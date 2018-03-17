import {PositionTransformer} from "./PositionTransformer";

export class Human {
    private tileWalk: Phaser.TileSprite;
    private tileWalkReverse: Phaser.TileSprite;
    private tileDefault: Phaser.TileSprite;
    private tileDefaultReverse: Phaser.TileSprite;
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

        this.tileWalk = game.add.tileSprite(realX, realY, 24, 24, 'walk');
        this.tileWalk.animations.add('walk');
        this.tileWalk.animations.play('walk', 12, true);
        this.tileWalk.alpha = 0;
        this.tileWalk.anchor.set(0.5, 1.3);
        game.add.existing(this.tileWalk);

        this.tileDefault = game.add.tileSprite(realX, realY, 24, 24, 'default');
        this.tileDefault.animations.add('default');
        this.tileDefault.animations.play('default', 12, true);
        this.tileDefault.alpha = 1;
        this.tileDefault.anchor.set(0.5, 1.3);
        game.add.existing(this.tileDefault);

        this.tileWalkReverse = game.add.tileSprite(realX, realY, 24, 24, 'walk_reverse');
        this.tileWalkReverse.animations.add('walk_reverse');
        this.tileWalkReverse.animations.play('walk_reverse', 12, true);
        this.tileWalkReverse.alpha = 0;
        this.tileWalkReverse.anchor.set(0.5, 1.3);
        game.add.existing(this.tileWalkReverse);

        this.tileDefaultReverse = game.add.tileSprite(realX, realY, 24, 24, 'default_reverse');
        this.tileDefaultReverse.animations.add('default_reverse');
        this.tileDefaultReverse.animations.play('default_reverse', 12, true);
        this.tileDefaultReverse.alpha = 0;
        this.tileDefaultReverse.anchor.set(0.5, 1.3);
        game.add.existing(this.tileDefaultReverse);

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
        this.game.add.tween(this.tileDefault.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1000, 'Linear', true).onComplete.add(this.isNotMoving, this);
        this.game.add.tween(this.tileDefaultReverse.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1000, 'Linear', true);
        this.game.add.tween(this.tileWalk.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1000, 'Linear', true);
        this.game.add.tween(this.tileWalkReverse.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x,
            y: PositionTransformer.getRealPosition(this.cell).y
        }, 1000, 'Linear', true);
    }

    private isNotMoving() {
        this.isMoving = false;
        this.loadDefault();
    }

    private loadMove() {
        this.tileDefault.alpha = 0;
        this.tileDefaultReverse.alpha = 0;
        if (this.isTop) {
            this.tileWalkReverse.alpha = 1;
            this.tileWalk.alpha = 0;
            this.tileWalkReverse.scale.set(this.isLeft ? 1 : -1, 1);
        } else {
            this.tileWalk.alpha = 1;
            this.tileWalkReverse.alpha = 0;
            this.tileWalk.scale.set(this.isLeft ? 1 : -1, 1);
        }
    }

    private loadDefault() {
        this.tileWalkReverse.alpha = 0;
        this.tileWalk.alpha = 0;
        if (this.isTop) {
            this.tileDefaultReverse.alpha = 1;
            this.tileDefault.alpha = 0;
            this.tileDefaultReverse.scale.set(this.isLeft ? 1 : -1, 1);
        } else {
            this.tileDefault.alpha = 1;
            this.tileDefaultReverse.alpha = 0;
            this.tileDefault.scale.set(this.isLeft ? 1 : -1, 1);
        }
    }
}