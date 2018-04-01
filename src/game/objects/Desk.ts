import {PositionTransformer} from "../PositionTransformer";
import {SittableInterface} from "./SittableInterface";
import {DIRECTION} from "../Direction";
import {ObjectMover} from "./ObjectMover";
import {World} from "../World";
import {MovableObjectInterface} from "./MovableObjectInterface";

/**
 * This variable will fake the position of the sprite without changing it for the enduser.
 * A negative number (e.g. -10) will draw the object 10 pixels on the top but will update the anchor to put it back
 * to its position.
 * If the Human is not seen because the object is in front of it, you have to put a more negative number.
 * @type {number}
 */
const FAKE_ANCHOR_BOTTOM = -4;
/**
 * Negative : will display the object to the left
 * @type {number}
 */
const GAP_HORIZONTAL = -10;

/**
 * Negative: Will display the object to the top
 * @type {number}
 */
const GAP_VERTICAL = -8;

export class Desk implements SittableInterface, MovableObjectInterface {
    private deskSprite: Phaser.Sprite;
    private chairSprite: Phaser.Sprite;
    private position: PIXI.Point;
    private world: World;

    constructor(point: PIXI.Point, world: World) {
        this.position = point;
        this.world = world;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        const isLeftOriented = Math.random() >= 0.5;

        this.chairSprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + (isLeftOriented ? - GAP_HORIZONTAL : GAP_HORIZONTAL),
            PositionTransformer.getRealPosition(this.position).y + FAKE_ANCHOR_BOTTOM + GAP_VERTICAL,
            'chair'
        );
        this.deskSprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y + FAKE_ANCHOR_BOTTOM,
            'desk'
        );
        this.chairSprite.anchor.set(0.5, 1 + FAKE_ANCHOR_BOTTOM/this.chairSprite.height);
        this.deskSprite.anchor.set(0.5, 1 + FAKE_ANCHOR_BOTTOM/this.deskSprite.height);

        console.log('chair: ' + this.chairSprite.y);
        console.log('desk:  ' + this.deskSprite.y);

        ObjectMover.makeMovable(this, this.world);

        if (isLeftOriented) {
            this.deskSprite.scale.set(-1, 1);
            this.chairSprite.scale.set(-1, 1);
        }

        group.add(this.chairSprite);
        group.add(this.deskSprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(this.isLeftOriented() ? - GAP_HORIZONTAL : GAP_HORIZONTAL, GAP_VERTICAL - 2);
    }

    getEntries(): DIRECTION[] {
        return this.isLeftOriented() ?
            [DIRECTION.LEFT, DIRECTION.RIGHT, DIRECTION.TOP] :
            [DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT];
    }

    private isLeftOriented() {
        return this.deskSprite.scale.x === -1;
    }

    forceOrientation(): boolean {
        return this.isLeftOriented();
    }

    getSprites(): Phaser.Sprite[] {
        return [this.deskSprite, this.chairSprite];
    }

    tryToMove(point: PIXI.Point): void {
        if (this.world.isFreePosition(point, this)) {
            this.position = point;
            this.chairSprite.position.x = PositionTransformer.getRealPosition(this.position).x + (this.isLeftOriented() ? - GAP_HORIZONTAL : GAP_HORIZONTAL);
            this.chairSprite.position.y = PositionTransformer.getRealPosition(this.position).y + FAKE_ANCHOR_BOTTOM + GAP_VERTICAL;
            this.deskSprite.position.x = PositionTransformer.getRealPosition(this.position).x;
            this.deskSprite.position.y = PositionTransformer.getRealPosition(this.position).y + FAKE_ANCHOR_BOTTOM;
        }
    }
}
