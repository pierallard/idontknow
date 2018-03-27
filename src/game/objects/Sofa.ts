import {PositionTransformer} from "../PositionTransformer";

export const SOFA_BOTTOM = -8;
export const SOFA_LEFT = 0;
const SOFA_ANCHOR_BOTTOM = 3;

export class Sofa {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;

    constructor(point: PIXI.Point) {
        this.position = point;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + SOFA_LEFT,
            PositionTransformer.getRealPosition(this.position).y + SOFA_BOTTOM - SOFA_ANCHOR_BOTTOM,
            'sofa'
        );
        this.sprite.anchor.set(0.5, 1.0 - SOFA_ANCHOR_BOTTOM/this.sprite.height);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}
