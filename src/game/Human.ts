import {PositionTransformer} from "./PositionTransformer";
import {World} from "./World";
import {HumanState} from "./human_states/HumanState";
import {FreezeState} from "./human_states/FreezeState";
import {MoveRandomState} from "./human_states/MoveRandomState";
import {SmokeState} from "./human_states/SmokeState";
import {SitState} from "./human_states/SitState";
import {ClosestPathFinder} from "./ClosestPathFinder";
import {DIRECTION, Direction} from "./Direction";
import {Sofa, SOFA_BOTTOM, SOFA_LEFT} from "./objects/Sofa";

const FRAME_RATE = 12;
export enum ANIMATION {
    FREEZE,
    WALK,
    SMOKE,
    SIT_DOWN,
    STAND_UP
}
const TOP_ORIENTED_ANIMATION = '_reverse';
export const WALK_CELL_DURATION = 1200;
const GAP_FROM_BOTTOM = -8;

export class Human {
    private tile: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private moving: boolean;
    private goal: PIXI.Point;
    private pathfinder: Phaser.Plugin.PathFinderPlugin;
    private path: PIXI.Point[];
    private world: World;
    private state: HumanState;
    private closestPathFinder: ClosestPathFinder;
    private anchorPixels: PIXI.Point;

    constructor(cell: PIXI.Point) {
        this.cell = cell;
        this.moving = false;
        this.path = [];
        this.state = new FreezeState(this);
        this.anchorPixels = new PIXI.Point(0, GAP_FROM_BOTTOM);
    }

    create(game: Phaser.Game, group: Phaser.Group, world: World) {
        this.game = game;
        this.world = world;

        this.tile = game.add.tileSprite(
            PositionTransformer.getRealPosition(this.cell).x + this.anchorPixels.x,
            PositionTransformer.getRealPosition(this.cell).y + this.anchorPixels.y,
            24,
            25,
            'human'
        );
        this.addAnimations();
        this.tile.anchor.set(0.5, 1.0);

        this.loadAnimation(ANIMATION.FREEZE, true, false);

        this.tile.inputEnabled = true;
        this.tile.events.onInputDown.add(this.select, this);

        group.add(this.tile);

        this.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.pathfinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());

        this.closestPathFinder = new ClosestPathFinder(game, world);

        this.state.start(game);
    }

    update() {
        // console.log(Math.round(this.tile.anchor.y * this.tile.height) + ', ' + Math.round(this.tile.anchor.x * this.tile.width) + ' - ' + Math.round(this.tile.position.x) + ', ' + Math.round(this.tile.position.y));
        if (!this.state.isActive()) {
            const states: HumanState[] = [
                new SmokeState(this, this.tile.animations.getAnimation(ANIMATION.SMOKE + '').frameTotal * Phaser.Timer.SECOND / FRAME_RATE),
                new FreezeState(this),
                new MoveRandomState(this, this.world),
            ];
            const randomSofa = this.world.getRandomFreeSofa();
            if (randomSofa !== null) {
                states.push(new SitState(
                    this,
                    this.tile.animations.getAnimation(ANIMATION.SIT_DOWN + '').frameTotal * Phaser.Timer.SECOND / FRAME_RATE,
                    randomSofa,
                    this.world
                ));
            }
            this.state = states[Math.floor(Math.random() * states.length)];
            this.state.start(this.game);
            console.log('New state: ' + this.state.constructor.name);
        }
    }

    private select() {
        this.tile.loadTexture('human_selected', this.tile.frame, false);
    }

    hasPath(cell: PIXI.Point): boolean {
        return this.closestPathFinder.getPath(this.cell, cell) !== null;
    }

    moveTo(cell: PIXI.Point) {
        const path = this.closestPathFinder.getPath(this.cell, cell);
        if (path !== null) {
            this.goal = cell;
            this.path = path;
            if (!this.moving) {
                this.popPath(null, null);
            }
        }
    }

    moveToClosest(cell: PIXI.Point) {
        const path = this.closestPathFinder.getNeighborPath(this.cell, cell);
        if (path !== null) {
            this.goal = cell;
            this.path = path;
            if (!this.moving) {
                this.popPath(null, null);
            }
        }
    }

    private animateMove(direction: DIRECTION) {
        const isLeft = Human.isHumanLeft(direction);
        const isTop = Human.isHumanTop(direction);
        this.loadAnimation(ANIMATION.WALK, isLeft, isTop);
        this.moving = true;
        this.game.add.tween(this.tile.position).to({
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
            this.goal = null;
            this.loadAnimation(ANIMATION.FREEZE, isLeft, isTop);
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
        this.world.humanMoved(humanPositions);
    }

    loadAnimation(animation: ANIMATION, isLeft: boolean = null, isTop: boolean = null) {
        switch (animation) {
            case ANIMATION.FREEZE:
            case ANIMATION.WALK:
                const animationName = this.getAnimationName(animation, isTop);
                if (this.tile.animations.name !== animationName) {
                    this.tile.animations.play(animationName, FRAME_RATE, true);
                }
                if (isLeft != null) {
                    this.tile.scale.set(isLeft ? 1 : -1, 1);
                }
                break;
            case ANIMATION.SMOKE:
                const animationSmokeName = animation + '';
                if (this.tile.animations.name !== animationSmokeName) {
                    this.tile.animations.play(animationSmokeName, FRAME_RATE, true);
                }
                break;
            case ANIMATION.SIT_DOWN:
            case ANIMATION.STAND_UP:
                const animationSitDownName = animation + '';
                if (this.tile.animations.name !== animationSitDownName) {
                    this.tile.animations.play(animationSitDownName, FRAME_RATE, false);
                }
                break;
            default:
                console.log('UNKNOWN ANIMATION ' + animation);
        }
    }

    getPosition() {
        return this.cell;
    }

    private getAnimationName(animation: ANIMATION, isTop: boolean = null): string {
        if (isTop === null) {
            return this.getAnimationName(animation, this.tile.animations.name.endsWith(TOP_ORIENTED_ANIMATION));
        }

        return animation + (isTop ? TOP_ORIENTED_ANIMATION : '');
    }

    isMoving(): boolean {
        return this.moving;
    }

    private addAnimations() {
        this.tile.animations.add(ANIMATION.WALK + '', [0, 1, 2, 3, 4, 5]);
        this.tile.animations.add(ANIMATION.WALK + TOP_ORIENTED_ANIMATION, [6, 7, 8, 9, 10, 11]);
        this.tile.animations.add(ANIMATION.FREEZE + '', [12, 13, 14]);
        this.tile.animations.add(ANIMATION.FREEZE + TOP_ORIENTED_ANIMATION, [18, 19, 20]);
        let smoke_frames = [24, 25, 26, 27, 30, 31, 32, 33];
        for (let i = 0; i < 6; i++) {
            // Take smoke length
            smoke_frames.push(33)
        }
        smoke_frames = smoke_frames.concat([32, 31, 30, 27, 26, 25, 24]);
        for (let i = 0; i < 20; i++) {
            // Do nothing length
            smoke_frames.push(24)
        }
        this.tile.animations.add(ANIMATION.SMOKE + '', smoke_frames);
        this.tile.animations.add(ANIMATION.SIT_DOWN + '', [12, 36, 37, 38, 39]);
        this.tile.animations.add(ANIMATION.STAND_UP + '', [39, 38, 37, 36, 12]);
    }

    goToSofa(position: PIXI.Point) {
        const direction = Direction.getNeighborDirection(this.cell, position);
        // Human has to gap 5px from the sofa to be sit properly, and 1px from the bottom.
        this.anchorPixels.x = SOFA_LEFT + (Human.isHumanLeft(direction) ? -5 : 5);
        this.anchorPixels.y = SOFA_BOTTOM - 1;
        this.cell = position;
        this.animateMove(direction);
    }

    private static isHumanLeft(direction: DIRECTION) {
        return [DIRECTION.LEFT, DIRECTION.BOTTOM].indexOf(direction) > -1;
    }

    private static isHumanTop(direction: DIRECTION) {
        return [DIRECTION.LEFT, DIRECTION.TOP].indexOf(direction) > -1;
    }

    goToFreeCell() {
        const cells = [];
        Direction.neighborDirections().forEach((direction) => {
            const tryCell = Direction.getGap(this.cell, direction);
            if (this.world.getGround().isFree(tryCell)) {
                cells.push(tryCell);
            }
        });
        const freeCell = cells[Math.floor(Math.random() * cells.length)];
        this.goal = freeCell;
        this.path = [freeCell];
        if (!this.moving) {
            this.popPath(null, null);
        }
    }
}
