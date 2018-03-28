import {PositionTransformer} from "../PositionTransformer";
import {SittableInterface} from "./SittableInterface";

const CHAIR_BOTTOM = -10;
const CHAIR_LEFT = -10;
const CHAIR_ANCHOR_BOTTOM = 2;

export class Desk implements SittableInterface {
    private deskSprite: Phaser.Sprite;
    private chairSprite: Phaser.Sprite;
    private position: PIXI.Point;

    constructor(point: PIXI.Point) {
        this.position = point;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.chairSprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + CHAIR_LEFT,
            PositionTransformer.getRealPosition(this.position).y + CHAIR_BOTTOM,
            'chair'
        );
        this.deskSprite = game.add.sprite(PositionTransformer.getRealPosition(this.position).x, PositionTransformer.getRealPosition(this.position).y, 'desk');
        this.chairSprite.anchor.set(0.5, 1 - CHAIR_ANCHOR_BOTTOM/this.chairSprite.height);
        this.deskSprite.anchor.set(0.5, 1);

        // if (Math.random() >= 0.5) {
        //     this.deskSprite.scale.set(-1, 1);
        //     this.chairSprite.scale.set(-1, 1);
        // }

        group.add(this.chairSprite);
        group.add(this.deskSprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(CHAIR_LEFT, CHAIR_BOTTOM);
    }
}