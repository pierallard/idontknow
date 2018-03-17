import {PositionTransformer} from "./PositionTransformer";

export class Human {
    private tile: Phaser.TileSprite;
    private cell: PIXI.Point;
    private game: Phaser.Game;
    private isMoving: boolean;
    private isLeft: boolean;
    private isTop: boolean;

    constructor(game: Phaser.Game, cell: PIXI.Point) {
        const realX = PositionTransformer.getRealPosition(cell).x;
        const realY = PositionTransformer.getRealPosition(cell).y;
        this.cell = cell;
        this.game = game;
        this.isMoving = false;
        this.isLeft = false;
        this.isTop = false;

        this.tile = game.add.tileSprite(realX, realY, 24, 24, 'human');
        this.tile.animations.add('walk', [0, 1, 2, 3, 4, 5]);
        this.tile.animations.add('walk_reverse', [6, 7, 8, 9, 10, 11]);
        this.tile.animations.add('default', [12, 13, 14]);
        this.tile.animations.add('default_reverse', [18, 19, 20]);
        this.tile.anchor.set(0.5, 1.3);
        this.tile.animations.play('default', 12, true);

        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.moveLeft, this);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.moveRight, this);
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.moveUp, this);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.moveDown, this);
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
        this.loadMove();
        this.isMoving = true;
        this.game.add.tween(this.tile.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1000, 'Linear', true).onComplete.add(this.isNotMoving, this);
    }

    private isNotMoving() {
        this.isMoving = false;
        this.loadDefault();
    }

    private loadMove() {
        if (this.isTop) {
            this.tile.animations.play('walk_reverse', 12, true);
        } else {
            this.tile.animations.play('walk', 12, true);
        }
        this.tile.scale.set(this.isLeft ? 1 : -1, 1);
    }

    private loadDefault() {
        if (this.isTop) {
            this.tile.animations.play('default_reverse', 12, true);
        } else {
            this.tile.animations.play('default', 12, true);
        }
        this.tile.scale.set(this.isLeft ? 1 : -1, 1);
    }
}