import {PositionTransformer} from "../PositionTransformer";
import {World} from "../World";
import {ClosestPathFinder} from "../ClosestPathFinder";
import {DIRECTION, Direction} from "../Direction";
import {SittableInterface} from "../objects/SittableInterface";
import {ANIMATION, HumanAnimationManager} from "./HumanAnimationManager";
import {HumanStateManager} from "./HumanStateManager";

export const WALK_CELL_DURATION = 1200;
const GAP_FROM_BOTTOM = -8;

export class Human {
    tile: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private moving: boolean;
    private pathfinder: Phaser.Plugin.PathFinderPlugin;
    private path: PIXI.Point[];
    private world: World;
    private closestPathFinder: ClosestPathFinder;
    private anchorPixels: PIXI.Point;
    private animationManager: HumanAnimationManager;
    private stateManager: HumanStateManager;

    constructor(cell: PIXI.Point) {
        this.cell = cell;
        this.moving = false;
        this.path = [];
        this.stateManager = new HumanStateManager(this);
        this.anchorPixels = new PIXI.Point(0, GAP_FROM_BOTTOM);
        this.animationManager = new HumanAnimationManager();
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
        this.animationManager.create(this.tile);

        this.tile.anchor.set(0.5, 1.0);

        this.animationManager.loadAnimation(ANIMATION.FREEZE, true, false);

        this.tile.inputEnabled = true;
        this.tile.events.onInputDown.add(this.select, this);

        group.add(this.tile);

        this.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.pathfinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());

        this.closestPathFinder = new ClosestPathFinder(game, world);

        this.stateManager.create(game, world, this.animationManager);
    }

    update() {
        this.stateManager.updateState(this.game);
    }

    private select() {
        this.tile.loadTexture('human_selected', this.tile.frame, false);
    }

    moveTo(cell: PIXI.Point) {
        const path = this.closestPathFinder.getPath(this.cell, cell);
        if (path !== null) {
            this.path = path;
            if (!this.moving) {
                this.popPath(null, null);
            }
        }
    }

    moveToClosest(cell: PIXI.Point, entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]) {
        const path = this.closestPathFinder.getNeighborPath(this.cell, cell, entries);
        if (path !== null) {
            this.path = path;
            if (!this.moving) {
                this.popPath(null, null);
            }
        }
    }

    private animateMove(direction: DIRECTION) {
        const isLeft = Human.isHumanLeft(direction);
        const isTop = Human.isHumanTop(direction);
        this.animationManager.loadAnimation(ANIMATION.WALK, isLeft, isTop);
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
        this.world.humanMoved(humanPositions);
    }

    getPosition() {
        return this.cell;
    }

    isMoving(): boolean {
        return this.moving;
    }

    goToSittable(sittable: SittableInterface) {
        const direction = Direction.getNeighborDirection(this.cell, sittable.getPosition());
        // Human has to gap 5px from the sofa to be sit properly, and 1px from the bottom.
        this.anchorPixels.x = sittable.getPositionGap().x + (Human.isHumanLeft(direction) ? -5 : 5);
        this.anchorPixels.y = sittable.getPositionGap().y - 1;
        this.cell = sittable.getPosition();
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
            if (this.world.getGround().isFree(tryCell)) {
                cells.push(tryCell);
            }
        });
        const freeCell = cells[Math.floor(Math.random() * cells.length)];
        this.path = [freeCell];
        if (!this.moving) {
            this.popPath(null, null);
        }
    }

    loadAnimation(animation: ANIMATION) {
        this.animationManager.loadAnimation(animation);
    }
}
