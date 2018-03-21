import {PositionTransformer} from "./PositionTransformer";
import {World} from "./World";
import {HumanState} from "./human_states/HumanState";
import {FreezeState} from "./human_states/FreezeState";
import {MoveRandomState} from "./human_states/MoveRandomState";

const FRAME_RATE = 12;

export class Human {
    private tile: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private isMoving: boolean;
    private goal: PIXI.Point;
    private pathfinder: Phaser.Plugin.PathFinderPlugin;
    private path: PIXI.Point[];
    private world: World;
    private state: HumanState;

    constructor(cell: PIXI.Point) {
        this.cell = cell;
        this.isMoving = false;
        this.path = [];
        this.state = new FreezeState(this);
    }

    create(game: Phaser.Game, group: Phaser.Group, world: World) {
        this.state.start(game);
        this.game = game;
        this.world = world;

        this.tile = game.add.tileSprite(
            PositionTransformer.getRealPosition(this.cell).x,
            PositionTransformer.getRealPosition(this.cell).y,
            24,
            25,
            'human'
        );
        this.tile.animations.add('walk', [0, 1, 2, 3, 4, 5]);
        this.tile.animations.add('walk_reverse', [6, 7, 8, 9, 10, 11]);
        this.tile.animations.add('default', [12, 13, 14]);
        this.tile.animations.add('default_reverse', [18, 19, 20]);
        this.tile.anchor.set(0.5, 1.0 + 8/25);
        this.tile.animations.play('default', FRAME_RATE, true);

        this.tile.inputEnabled = true;
        this.tile.events.onInputDown.add(this.select, this);

        group.add(this.tile);

        this.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.pathfinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());
    }

    update() {
        if (!this.state.isActive()) {
            this.state = Math.random() > 0.5 ? new MoveRandomState(this) : new FreezeState(this);
            this.state.start(this.game);
        }
    }

    private select() {
        this.tile.loadTexture('human_selected', this.tile.frame, false);
    }

    moveTo(cell: PIXI.Point) {
        if (this.cell.x === cell.x && this.cell.y === cell.y) {
            return;
        }

        this.pathfinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            if (path) {
                this.goal = cell;
                this.path = [];
                for (let i = 1, ilen = path.length; i < ilen; i++) {
                    this.path.push(new PIXI.Point(path[i].x, path[i].y));
                }
                if (!this.isMoving) {
                    this.continueMoving(null, null);
                }
            }
        });

        try {
            this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x, cell.y]);
            this.pathfinder.calculatePath();
        } catch(error) {
            console.log(error);
        }
    }

    private moveLeft() {
        if (!this.isMoving) {
            this.cell.x += 1;
            this.runTween(true, true);
        }
    }

    private moveRight() {
        if (!this.isMoving) {
            this.cell.x -= 1;
            this.runTween(false, false);
        }
    }

    private moveUp() {
        if (!this.isMoving) {
            this.cell.y += 1;
            this.runTween(false, true);
        }
    }

    private moveDown() {
        if (!this.isMoving) {
            this.cell.y -= 1;
            this.runTween(true, false);
        }
    }

    private runTween(isLeft: boolean, isTop: boolean) {
        this.loadMoveTexture(isLeft, isTop);
        this.isMoving = true;
        this.game.add.tween(this.tile.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1200, 'Linear', true).onComplete.add(this.moveFinished, this, 0, isLeft, isTop);
    }

    private moveFinished(_tweenValues: any, _game: any, isLeft: boolean, isTop: boolean) {
        this.continueMoving(isLeft, isTop);
    }

    private continueMoving(isLeft: boolean, isTop: boolean) {
        this.isMoving = false;
        let humanPositions = [this.cell];
        if (this.path.length == 0) {
            this.goal = null;
            this.loadStandTexture(isLeft, isTop);
        } else {
            const next = this.path.shift();
            if (next.x > this.cell.x) {
                this.moveLeft();
            } else if (next.x < this.cell.x) {
                this.moveRight();
            } else if (next.y > this.cell.y) {
                this.moveUp();
            } else if (next.y < this.cell.y) {
                this.moveDown();
            }
            humanPositions.push(this.cell);
        }
        this.world.humanMoved(humanPositions);
    }

    private loadMoveTexture(isLeft: boolean, isTop: boolean) {
        if (isTop) {
            this.tile.animations.play('walk_reverse', FRAME_RATE, true);
        } else {
            this.tile.animations.play('walk', FRAME_RATE, true);
        }
        this.tile.scale.set(isLeft ? 1 : -1, 1);
    }

    private loadStandTexture(isLeft: boolean, isTop: boolean) {
        if (isTop) {
            this.tile.animations.play('default_reverse', FRAME_RATE, true);
        } else {
            this.tile.animations.play('default', FRAME_RATE, true);
        }
        this.tile.scale.set(isLeft ? 1 : -1, 1);
    }

    getPosition() {
        return this.cell;
    }
}
