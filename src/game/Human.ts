import {PositionTransformer} from "./PositionTransformer";
import Play from "./game_state/Play";

const FRAME_RATE = 12;

export class Human {
    private tile: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private isMoving: boolean;
    private isLeft: boolean;
    private isTop: boolean;
    private play: Play;
    private goal: PIXI.Point;

    constructor(play: Play, game: Phaser.Game, cell: PIXI.Point) {
        const realX = PositionTransformer.getRealPosition(cell).x;
        const realY = PositionTransformer.getRealPosition(cell).y;
        this.cell = cell;
        this.game = game;
        this.isMoving = false;
        this.isLeft = false;
        this.isTop = false;
        this.play = play;

        this.tile = game.add.tileSprite(realX, realY, 24, 25, 'human');
        this.tile.animations.add('walk', [0, 1, 2, 3, 4, 5]);
        this.tile.animations.add('walk_reverse', [6, 7, 8, 9, 10, 11]);
        this.tile.animations.add('default', [12, 13, 14]);
        this.tile.animations.add('default_reverse', [18, 19, 20]);
        this.tile.anchor.set(0.5, 1.0 + 8/25);
        this.tile.animations.play('default', FRAME_RATE, true);

        this.tile.inputEnabled = true;
        this.tile.events.onInputDown.add(this.select, this);

        // game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.moveLeft, this);
        // game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.moveRight, this);
        // game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.moveUp, this);
        // game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.moveDown, this);
    }

    private select() {
        this.tile.loadTexture('human_selected', this.tile.frame, false);
        this.play.setHuman(this);
    }

    moveTo(cell: PIXI.Point) {
        this.goal = cell;
        if (!this.isMoving) {
            this.moveFinished();
        }
    }

    private moveLeft() {
        if (!this.isMoving) {
            this.cell.x += 1;
            this.isLeft = true;
            this.isTop = true;
            this.runTween();
        }
    }

    private moveRight() {
        if (!this.isMoving) {
            this.cell.x -= 1;
            this.isLeft = false;
            this.isTop = false;
            this.runTween();
        }
    }

    private moveUp() {
        if (!this.isMoving) {
            this.cell.y += 1;
            this.isLeft = false;
            this.isTop = true;
            this.runTween();
        }
    }

    private moveDown() {
        if (!this.isMoving) {
            this.cell.y -= 1;
            this.isLeft = true;
            this.isTop = false;
            this.runTween();
        }
    }

    private runTween() {
        this.loadMoveTexture();
        this.isMoving = true;
        this.game.add.tween(this.tile.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1200, 'Linear', true).onComplete.add(this.moveFinished, this);
    }

    private moveFinished() {
        this.isMoving = false;
        if (!this.goal || this.cell.x === this.goal.x && this.cell.y === this.goal.y) {
            console.log('finished');
            this.goal = null;
            this.loadStandTexture();
        } else {
            if (this.cell.x === this.goal.x) {
                if (this.goal.y > this.cell.y) {
                    this.moveUp();
                } else {
                    this.moveDown();
                }
            } else {
                if (this.goal.x > this.cell.x) {
                    this.moveLeft();
                } else {
                    this.moveRight();
                }
            }
        }
    }

    private loadMoveTexture() {
        if (this.isTop) {
            this.tile.animations.play('walk_reverse', FRAME_RATE, true);
        } else {
            this.tile.animations.play('walk', FRAME_RATE, true);
        }
        this.tile.scale.set(this.isLeft ? 1 : -1, 1);
    }

    private loadStandTexture() {
        if (this.isTop) {
            this.tile.animations.play('default_reverse', FRAME_RATE, true);
        } else {
            this.tile.animations.play('default', FRAME_RATE, true);
        }
        this.tile.scale.set(this.isLeft ? 1 : -1, 1);
    }
}