import {MovableObjectInterface} from "./MovableObjectInterface";
import {PositionTransformer} from "../PositionTransformer";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectMover} from "./ObjectMover";
import {DIRECTION} from "../Direction";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";

const DISPENSER_BOTTOM = -4;
const DISPENSER_LEFT = 4;
const DISPENSER_ANCHOR_BOTTOM = 3;

export class Dispenser implements MovableObjectInterface, InteractiveObjectInterface {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;
    private worldKnowledge: WorldKnowledge;

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge) {
        this.position = point;
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + DISPENSER_LEFT,
            PositionTransformer.getRealPosition(this.position).y + DISPENSER_BOTTOM - DISPENSER_ANCHOR_BOTTOM,
            'dispenser'
        );
        this.sprite.anchor.set(0.5, 1.0 - DISPENSER_ANCHOR_BOTTOM/this.sprite.height);

        ObjectMover.makeMovable(this, this.worldKnowledge);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getSprites(): Phaser.Sprite[] {
        return [this.sprite];
    }

    tryToMove(point: PIXI.Point): void {
        if (this.worldKnowledge.isFree(point, this)) {
            this.position = point;
            this.sprite.x = PositionTransformer.getRealPosition(this.position).x + DISPENSER_LEFT;
            this.sprite.y = PositionTransformer.getRealPosition(this.position).y + DISPENSER_BOTTOM - DISPENSER_ANCHOR_BOTTOM;
        }
    }

    getEntries(): DIRECTION[] {
        return [DIRECTION.BOTTOM];
    }

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(0, 0);
    }

    forceOrientation(): boolean {
        return true;
    }
}