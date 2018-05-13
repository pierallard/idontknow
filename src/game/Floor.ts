import {PositionTransformer} from "./PositionTransformer";

export class Floor {
    private position: PIXI.Point;
    private sprite: Phaser.Sprite;
    private key: string;

    constructor(point: PIXI.Point, key = 'woodcell') {
        this.position = point;
        this.key = key;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            this.key
        );

        this.sprite.anchor.setTo(0.5, (1 + 2.1) / 2);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}