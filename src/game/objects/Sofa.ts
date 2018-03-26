import {PositionTransformer} from "../PositionTransformer";

export class Sofa {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;

    constructor(point: PIXI.Point) {
        this.position = point;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(PositionTransformer.getRealPosition(this.position).x, PositionTransformer.getRealPosition(this.position).y, 'sofa');
        this.sprite.anchor.set(0.5, 1);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}