import {PositionTransformer} from "../PositionTransformer";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {DIRECTION} from "../Direction";
import {ObjectMover} from "./ObjectMover";
import {WorldKnowledge} from "../WorldKnowledge";
import {MovableObjectInterface} from "./MovableObjectInterface";

const SOFA_BOTTOM = -8;
const SOFA_LEFT = 0;
const SOFA_ANCHOR_BOTTOM = 3;

export class Sofa implements InteractiveObjectInterface, MovableObjectInterface {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;
    private worldKnowledge: WorldKnowledge;

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge) {
        this.position = point;
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + SOFA_LEFT,
            PositionTransformer.getRealPosition(this.position).y + SOFA_BOTTOM - SOFA_ANCHOR_BOTTOM,
            'sofa'
        );
        this.sprite.anchor.set(0.5, 1.0 - SOFA_ANCHOR_BOTTOM/this.sprite.height);

        ObjectMover.makeMovable(this, this.worldKnowledge);

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

    forceOrientation(): boolean {
        return null;
    }

    getSprites(): Phaser.Sprite[] {
        return [this.sprite];
    }

    tryToMove(point: PIXI.Point): void {
        if (this.worldKnowledge.isFree(point, this)) {
            this.position = point;
            this.sprite.x = PositionTransformer.getRealPosition(this.position).x + SOFA_LEFT;
            this.sprite.y = PositionTransformer.getRealPosition(this.position).y + SOFA_BOTTOM - SOFA_ANCHOR_BOTTOM;
        }
    }
}
