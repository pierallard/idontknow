import {PositionTransformer} from "./PositionTransformer";
import {World} from "./World";
import {HumanState} from "./human_states/HumanState";
import {FreezeState} from "./human_states/FreezeState";
import {MoveRandomState} from "./human_states/MoveRandomState";
import {SmokeState} from "./human_states/SmokeState";
import {SitState} from "./human_states/SitState";

const FRAME_RATE = 12;
export enum ANIMATION {
    FREEZE,
    WALK,
    SMOKE,
    SIT_DOWN,
    STAND_UP
}
const TOP_ORIENTED_ANIMATION = '_reverse';

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

    constructor(cell: PIXI.Point) {
        this.cell = cell;
        this.moving = false;
        this.path = [];
        this.state = new FreezeState(this);
    }

    create(game: Phaser.Game, group: Phaser.Group, world: World) {
        this.game = game;
        this.world = world;

        this.tile = game.add.tileSprite(
            PositionTransformer.getRealPosition(this.cell).x,
            PositionTransformer.getRealPosition(this.cell).y,
            24,
            25,
            'human'
        );
        this.addAnimations();
        this.tile.anchor.set(0.5, 1.0 + 8/25);

        this.loadAnimation(ANIMATION.FREEZE, true, false);

        this.tile.inputEnabled = true;
        this.tile.events.onInputDown.add(this.select, this);

        group.add(this.tile);

        this.pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.pathfinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());

        this.state.start(game);
    }

    update() {
        if (!this.state.isActive()) {
            const states = [
                // new SmokeState(this, this.tile.animations.getAnimation(ANIMATION.SMOKE + '').frameTotal * Phaser.Timer.SECOND / FRAME_RATE),
                new FreezeState(this),
                // new MoveRandomState(this, this.world),
                new SitState(
                    this,
                    this.tile.animations.getAnimation(ANIMATION.SIT_DOWN + '').frameTotal * Phaser.Timer.SECOND / FRAME_RATE,
                    this.world
                ),
            ];
            this.state = states[Math.floor(Math.random() * states.length)];
            this.state.start(this.game);
            console.log('New state: ' + this.state.constructor.name);
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
                if (!this.moving) {
                    this.continueMoving(null, null);
                }
            } else {
                console.log('No path found!');
            }
        });

        this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x, cell.y]);
        this.pathfinder.calculatePath();
    }

    moveToClosest(cell: PIXI.Point) {
        this._tryMoveLeft(cell);
    }

    private _tryMoveLeft(cell: PIXI.Point) {
        if (this.cell.x === cell.x + 1 && this.cell.y === cell.y) {
            this._tryMoveRight(cell, { 'left': [] });
        }

        this.pathfinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            this._tryMoveRight(cell, { 'left': path });
        });

        try {
            this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x + 1, cell.y]);
            this.pathfinder.calculatePath();
        } catch (e) {
            console.log('_tryMoveLeft (' + this.cell.x + ',' + this.cell.y + ')->(' + (cell.x + 1) + ',' + (cell.y) + ') encountered exception : ' + e);
            this._tryMoveRight(cell, { 'left': null });
        }
    }

    private _tryMoveRight(cell: PIXI.Point, previousPaths) {
        if (this.cell.x === cell.x - 1 && this.cell.y === cell.y) {
            this._tryMoveTop(cell, Object.assign(previousPaths, { 'right': [] }));
        }

        this.pathfinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            this._tryMoveTop(cell, Object.assign(previousPaths, { 'right': path }));
        });

        try {
            this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x - 1, cell.y]);
            this.pathfinder.calculatePath();
        } catch (e) {
            console.log('_tryMoveRight (' + this.cell.x + ',' + this.cell.y + ')->(' + (cell.x - 1) + ',' + (cell.y) + ') encountered exception : ' + e);
            this._tryMoveTop(cell, Object.assign(previousPaths, { 'right': null }));
        }
    }

    private _tryMoveTop(cell: PIXI.Point, previousPaths) {
        if (this.cell.x === cell.x && this.cell.y === cell.y + 1) {
            this._tryMoveBottom(cell, Object.assign(previousPaths, { 'top': [] }));
        }

        this.pathfinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            this._tryMoveBottom(cell, Object.assign(previousPaths, { 'top': path }));
        });

        try {
            this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x, cell.y + 1]);
            this.pathfinder.calculatePath();
        } catch (e) {
            console.log('_tryMoveTop (' + this.cell.x + ',' + this.cell.y + ')->(' + (cell.x) + ',' + (cell.y + 1) + ') encountered exception : ' + e);;
            this._tryMoveBottom(cell, Object.assign(previousPaths, { 'top': null }));
        }
    }

    private _tryMoveBottom(cell: PIXI.Point, previousPaths) {
        if (this.cell.x === cell.x && this.cell.y === cell.y - 1) {
            this._finishMoveClosest(cell, Object.assign(previousPaths, { 'bottom': [] }));
        }

        this.pathfinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            this._finishMoveClosest(cell, Object.assign(previousPaths, { 'bottom': path }));
        });

        try {
            this.pathfinder.preparePathCalculation([this.cell.x, this.cell.y], [cell.x, cell.y - 1]);
            this.pathfinder.calculatePath();
        } catch (e) {
            console.log('_tryMoveBottom (' + this.cell.x + ',' + this.cell.y + ')->(' + (cell.x) + ',' + (cell.y - 1) + ') encountered exception : ' + e);
            this._finishMoveClosest(cell, Object.assign(previousPaths, { 'bottom': null }));
        }
    }

    private _finishMoveClosest(cell, previousPaths) {
        console.log(previousPaths);
    }

    private moveLeft() {
        if (!this.moving) {
            this.cell.x += 1;
            this.runTween(true, true);
        }
    }

    private moveRight() {
        if (!this.moving) {
            this.cell.x -= 1;
            this.runTween(false, false);
        }
    }

    private moveUp() {
        if (!this.moving) {
            this.cell.y += 1;
            this.runTween(false, true);
        }
    }

    private moveDown() {
        if (!this.moving) {
            this.cell.y -= 1;
            this.runTween(true, false);
        }
    }

    private runTween(isLeft: boolean, isTop: boolean) {
        this.loadAnimation(ANIMATION.WALK, isLeft, isTop);
        this.moving = true;
        this.game.add.tween(this.tile.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1200, 'Linear', true).onComplete.add(this.moveFinished, this, 0, isLeft, isTop);
    }

    private moveFinished(_tweenValues: any, _game: any, isLeft: boolean, isTop: boolean) {
        this.continueMoving(isLeft, isTop);
    }

    private continueMoving(isLeft: boolean, isTop: boolean) {
        this.moving = false;
        let humanPositions = [this.cell];
        if (this.path.length == 0) {
            this.goal = null;
            this.loadAnimation(ANIMATION.FREEZE, isLeft, isTop);
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
            } else {
                debugger;
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
        this.tile.animations.add(ANIMATION.SIT_DOWN + '', [36, 37, 38, 39]);
        this.tile.animations.add(ANIMATION.STAND_UP + '', [39, 38, 37, 36]);
    }
}
