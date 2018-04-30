import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {DIRECTION} from "../Direction";
import {ObjectOrientation} from "./ObjectOrientation";

export class SpriteInfo {
    private spriteKey: string;
    private gap: PIXI.Point;
    private anchorBottom: number;
    private cellOffset: PIXI.Point;

    /**
     * Create a SpriteInfo
     *
     * @param {string} spriteKey
     * @param {number} gap The gap of the sprite from the bottom corner of the offset cell
     * @param {number} anchorBottom Used as a trick to show the user in front of the sprite.
     * @param {number} cellOffset The cell offset of the sprite is not on the origin cell
     */
    constructor(
        spriteKey: string,
        gap: PIXI.Point = new PIXI.Point(0, 0),
        anchorBottom: number = 0,
        cellOffset: PIXI.Point = new PIXI.Point(0, 0)
    ) {
        this.spriteKey = spriteKey;
        this.gap = gap;
        this.anchorBottom = anchorBottom;
        this.cellOffset = cellOffset;
    }

    getSpriteKey(): string {
        return this.spriteKey;
    }

    getAnchorBottom() {
        return this.anchorBottom;
    }

    getRealPosition(originCell: PIXI.Point, orientation: DIRECTION): PIXI.Point {
        return this.getRealPositionFromOrigin(PositionTransformer.getRealPosition(originCell), orientation);
    }

    getRealPositionFromOrigin(realPosition: PIXI.Point, orientation: DIRECTION, scale: number = 1) {
        return new PIXI.Point(
            realPosition.x + (ObjectOrientation.isHorizontalMirror(orientation) ? -1 : 1) * (this.gap.x - (this.cellOffset.x - this.cellOffset.y) * CELL_WIDTH / 2) * scale,
            realPosition.y + this.gap.y * scale - this.anchorBottom - ((this.cellOffset.x + this.cellOffset.y) * CELL_HEIGHT / 2) * scale
        )
    }

    getAnchor(sprite: Phaser.Sprite): PIXI.Point {
        return new PIXI.Point(
            0.5,
            1.0 - this.anchorBottom / sprite.height
        );
    }

    /**
     * Returns the gap from the origin cell. It takes the mirror effect in account. For examples:
     * [1, 0] => [0, 1]
     * [0, 1] => [1, 0]
     * [1, 1] => [1, 1]
     * @param {DIRECTION} orientation
     * @returns {PIXI.Point}
     */
    getCellOffset(orientation: DIRECTION): PIXI.Point {
        if (!ObjectOrientation.isHorizontalMirror(orientation)) {
            return this.cellOffset;
        } else {
            return new PIXI.Point(this.cellOffset.y, this.cellOffset.x)
        }
    }
}
