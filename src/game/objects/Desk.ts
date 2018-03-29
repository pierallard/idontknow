import {PositionTransformer} from "../PositionTransformer";
import {SittableInterface} from "./SittableInterface";
import {DIRECTION} from "../Direction";

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

export class Desk implements SittableInterface {
    private deskSprite: Phaser.Sprite;
    private chairSprite: Phaser.Sprite;
    private position: PIXI.Point;

    constructor(point: PIXI.Point) {
        this.position = point;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        const isLeftOriented = Math.random() >= 0.5;

        this.chairSprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + (isLeftOriented ? - GAP_HORIZONTAL : GAP_HORIZONTAL),
            PositionTransformer.getRealPosition(this.position).y + FAKE_ANCHOR_BOTTOM + GAP_VERTICAL,
            'chair'
        );
        this.deskSprite = game.add.sprite(PositionTransformer.getRealPosition(this.position).x, PositionTransformer.getRealPosition(this.position).y, 'desk');
        this.chairSprite.anchor.set(0.5, 1 + FAKE_ANCHOR_BOTTOM/this.chairSprite.height);
        this.deskSprite.anchor.set(0.5, 1);

        this.deskSprite.inputEnabled = true;
        this.deskSprite.input.pixelPerfectOver = true;
        this.deskSprite.input.pixelPerfectClick = true;
        this.deskSprite.input.useHandCursor = true;
        this.deskSprite.events.onInputDown.add(this.select, this);

        this.chairSprite.inputEnabled = true;
        this.chairSprite.input.pixelPerfectOver = true;
        this.chairSprite.input.pixelPerfectClick = true;
        this.chairSprite.input.useHandCursor = true;
        this.chairSprite.events.onInputDown.add(this.select, this);

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

    private select() {
        const isSelected = this.isSelected();
        this.deskSprite.loadTexture(isSelected ? 'desk' : 'desk_selected', this.deskSprite.frame, false);
        this.chairSprite.loadTexture(isSelected ? 'chair' : 'chair_selected', this.chairSprite.frame, false);
    }

    private isSelected() {
        return this.deskSprite.key === 'desk_selected';
    }
}
