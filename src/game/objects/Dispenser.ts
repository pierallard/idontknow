import {MovableObjectInterface} from "./MovableObjectInterface";
import {PositionTransformer} from "../PositionTransformer";
import {World} from "../World";
import {ObjectMover} from "./ObjectMover";

const DISPENSER_BOTTOM = -8;
const DISPENSER_LEFT = 0;
const DISPENSER_ANCHOR_BOTTOM = 3;

export class Dispenser implements MovableObjectInterface {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;
    private world: World;

    constructor(point: PIXI.Point, world: World) {
        this.position = point;
        this.world = world;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + DISPENSER_LEFT,
            PositionTransformer.getRealPosition(this.position).y + DISPENSER_BOTTOM - DISPENSER_ANCHOR_BOTTOM,
            'dispenser'
        );
        this.sprite.anchor.set(0.5, 1.0 - DISPENSER_ANCHOR_BOTTOM/this.sprite.height);

        ObjectMover.makeMovable(this, this.world);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getSprites(): Phaser.Sprite[] {
        return [this.sprite];
    }

    tryToMove(point: PIXI.Point): void {
        if (this.world.isFreePosition(point, this)) {
            this.position = point;
            this.sprite.x = PositionTransformer.getRealPosition(this.position).x + DISPENSER_LEFT;
            this.sprite.y = PositionTransformer.getRealPosition(this.position).y + DISPENSER_BOTTOM - DISPENSER_ANCHOR_BOTTOM;
        }
    }

}