import {PositionTransformer} from "./PositionTransformer";

export class Cell {
    private position: PIXI.Point;
    private sprite: Phaser.Sprite;

    constructor(point: PIXI.Point) {

        this.position = point;

    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            'woodcell'
        );

        this.sprite.anchor.setTo(0.5, 1);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}