import {CELL_HEIGHT, PositionTransformer} from "../PositionTransformer";
import {WorldKnowledge} from "../WorldKnowledge";
import {ClosestPathFinder} from "./ClosestPathFinder";
import {DIRECTION, Direction} from "../Direction";
import {InteractiveObjectInterface} from "../objects/InteractiveObjectInterface";
import {ANIMATION, HumanAnimationManager} from "./HumanAnimationManager";
import {HumanStateManager, STATE} from "./HumanStateManager";
import {ObjectSelector} from "../objects/ObjectSelector";
import {Meeting} from "../human_states/Meeting";
import {TalkBubble} from "./TalkBubble";

export const WALK_CELL_DURATION = 1200;
const GAP_FROM_BOTTOM = -8;
const PATH_DEBUG = false;

export class Human {
    private sprite: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private moving: boolean;
    private path: PIXI.Point[];
    private worldKnowledge: WorldKnowledge;
    private closestPathFinder: ClosestPathFinder;
    private anchorPixels: PIXI.Point;
    private animationManager: HumanAnimationManager;
    private stateManager: HumanStateManager;
    private pathGraphics: Phaser.Graphics;
    private talkBubble: TalkBubble;

    constructor(cell: PIXI.Point) {
        this.cell = cell;
        this.moving = false;
        this.path = [];
        this.stateManager = new HumanStateManager(this);
        this.anchorPixels = new PIXI.Point(0, GAP_FROM_BOTTOM);
        this.animationManager = new HumanAnimationManager();
        this.talkBubble = new TalkBubble();
    }

    create(game: Phaser.Game, group: Phaser.Group, worldKnowledge: WorldKnowledge) {
        this.game = game;
        this.worldKnowledge = worldKnowledge;

        this.sprite = game.add.tileSprite(
            PositionTransformer.getRealPosition(this.cell).x + this.anchorPixels.x,
            PositionTransformer.getRealPosition(this.cell).y + this.anchorPixels.y,
            24,
            25,
            Math.random() > 0.5 ? 'human' : 'human_red'
        );
        this.animationManager.create(this.sprite);
        this.sprite.anchor.set(0.5, 1.0);

        ObjectSelector.makeSelectable([this.sprite]);
        group.add(this.sprite);

        this.animationManager.loadAnimation(ANIMATION.FREEZE, true, false);
        this.closestPathFinder = new ClosestPathFinder(game, worldKnowledge);
        this.stateManager.create(game, worldKnowledge, this.animationManager);
        this.talkBubble.create(this.sprite, this.game, group);

        if (PATH_DEBUG) {
            this.pathGraphics = game.add.graphics(0, 0, group);
            group.add(this.pathGraphics);
        }
    }

    update() {
        this.talkBubble.update();
        this.stateManager.updateState(this.game);

        if (PATH_DEBUG) {
            this.pathGraphics.clear();
            this.pathGraphics.lineStyle(2, 0x00ff00);
            if (this.path !== null && this.path.length > 0) {
                this.pathGraphics.moveTo(
                    this.sprite.position.x,
                    this.sprite.position.y
                );
                this.path.forEach((pathItem) => {
                    this.pathGraphics.lineTo(
                        PositionTransformer.getRealPosition(pathItem).x,
                        PositionTransformer.getRealPosition(pathItem).y - CELL_HEIGHT / 2
                    );
                })
            }
        }
    }

    goMeeting(meeting: Meeting): boolean {
        return this.stateManager.goMeeting(this.game, meeting);
    }

    moveTo(cell: PIXI.Point): boolean {
        const path = this.closestPathFinder.getPath(this.cell, cell);
        if (path === null) {
            this.stateManager.reset(this.game);

            return false;
        }

        this.path = path;
        if (!this.moving) {
            this.popPath(null, null);
        }
        return true;
    }

    moveToClosest(cell: PIXI.Point, entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]): boolean {
        const path = this.closestPathFinder.getNeighborPath(this.cell, cell, entries);
        if (path === null) {
            this.stateManager.reset(this.game);

            return false;
        }

        this.path = path;
        if (!this.moving) {
            this.popPath(null, null);
        }

        return true;
    }

    private animateMove(direction: DIRECTION) {
        const isLeft = Human.isHumanLeft(direction);
        const isTop = Human.isHumanTop(direction);
        this.animationManager.loadAnimation(ANIMATION.WALK, isLeft, isTop);
        this.moving = true;
        this.game.add.tween(this.sprite.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x + this.anchorPixels.x,
            y: PositionTransformer.getRealPosition(this.cell).y + this.anchorPixels.y
        }, WALK_CELL_DURATION, 'Linear', true)
            .onComplete.add((_tweenValues: any, _game: any, isLeft: boolean, isTop: boolean) => {
            this.popPath(isLeft, isTop);
        }, this, 0, isLeft, isTop);
    }

    private popPath(isLeft: boolean, isTop: boolean) {
        this.moving = false;
        let humanPositions = [this.cell];
        if (this.path.length == 0) {
            this.animationManager.loadAnimation(ANIMATION.FREEZE, isLeft, isTop);
        } else {
            const next = this.path.shift();
            const direction = Direction.getNeighborDirection(this.cell, next);
            if (!this.moving) {
                this.cell = next;
                this.anchorPixels.x = 0;
                this.anchorPixels.y = GAP_FROM_BOTTOM;
                this.animateMove(direction);
            }
            humanPositions.push(this.cell);
        }
        this.worldKnowledge.humanMoved(humanPositions);
    }

    getPosition() {
        return this.cell;
    }

    isMoving(): boolean {
        return this.moving;
    }

    interactWith(interactiveObject: InteractiveObjectInterface, isLeft: boolean = null) {
        const direction = Direction.getNeighborDirection(this.cell, interactiveObject.getPosition());
        const side = (isLeft !== null) ? isLeft : Human.isHumanLeft(direction);
        // Human has to gap 5px from the sofa to be sit properly, and 1px from the bottom.
        this.anchorPixels.x = interactiveObject.getPositionGap().x + (side ? -5 : 5);
        this.anchorPixels.y = interactiveObject.getPositionGap().y - 1;
        this.cell = interactiveObject.getPosition();
        this.animateMove(direction);
    }

    private static isHumanLeft(direction: DIRECTION) {
        return [DIRECTION.LEFT, DIRECTION.BOTTOM].indexOf(direction) > -1;
    }

    private static isHumanTop(direction: DIRECTION) {
        return [DIRECTION.LEFT, DIRECTION.TOP].indexOf(direction) > -1;
    }

    goToFreeCell(entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]) {
        const cells = [];
        entries.forEach((direction) => {
            const tryCell = Direction.getGap(this.cell, direction);
            if (this.worldKnowledge.isFree(tryCell)) {
                cells.push(tryCell);
            }
        });
        if (cells.length === 0) {
            console.log('oops');
            debugger;
        } else {
            const freeCell = cells[Math.floor(Math.random() * cells.length)];
            this.path = [freeCell];
            if (!this.moving) {
                this.popPath(null, null);
            }
        }
    }

    loadAnimation(animation: ANIMATION, isLeft: boolean = null, isTop: boolean = null) {
        this.animationManager.loadAnimation(animation, isLeft, isTop);
    }

    isSelected(): boolean {
        return ObjectSelector.isSelected(this.sprite);
    }

    getSprite(): any {
        return this.sprite;
    }

    resetAStar(startPosition: PIXI.Point, endPosition: PIXI.Point) {
        console.log('Move object -> reset');
        this.closestPathFinder.reset();
        if (this.path !== null) {
            const matchingPath = this.path.filter((cell) => {
                return cell.x === endPosition.x && cell.y === endPosition.y;
            });
            if (matchingPath.length > 0) {
                const goal = this.path[this.path.length - 1];
                this.moveTo(goal);
                return;
            }
        }
        if (this.cell.x == startPosition.x && this.cell.y == startPosition.y) {
            this.stateManager.reset(this.game);
        }
    }

    isFree() {
        return [STATE.SIT, STATE.MOVE_RANDOM, STATE.FREEZE, STATE.SMOKE].indexOf(this.getState()) > -1;
    }

    private getState() {
        return this.stateManager.getState();
    }

    showTalkBubble() {
        this.talkBubble.show();
    }

    hideTalkBubble() {
        this.talkBubble.hide();
    }
}
