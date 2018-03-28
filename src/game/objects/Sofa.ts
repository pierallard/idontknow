import {PositionTransformer} from "../PositionTransformer";
import {SittableInterface} from "./SittableInterface";
import {DIRECTION} from "../Direction";

const SOFA_BOTTOM = -8;
const SOFA_LEFT = 0;
const SOFA_ANCHOR_BOTTOM = 3;

export class Sofa implements SittableInterface {
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

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(SOFA_LEFT, SOFA_BOTTOM);
    }

    getEntries(): DIRECTION[] {
        return [DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM];
    }
}
