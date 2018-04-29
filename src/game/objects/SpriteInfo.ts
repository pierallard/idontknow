import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {Direction, DIRECTION} from "../Direction";
import {ObjectOrientation} from "./ObjectOrientation";

export class SpriteInfo {
    private spriteKey: string;
    private left: number;
    private bottom: number;
    private anchorBottom: number;
    private gapLeft: number;
    private entryPoints: DIRECTION[];
    private cellOffset: PIXI.Point;
    private topLooking: boolean;
    private leftLooking: boolean;

    /**
     * Create a SpriteInfo
     *
     * @param {string} spriteKey
     * @param {DIRECTION[]} entryPoints The list of possible entry points to interact with this sprite. Let it empty
     * if there is no possible interaction with this sprite.
     * @param {number} left The horizontal gap of the sprite from the bottom corner of the offset cell
     * @param {number} bottom The vertical gap of the sprite from the bottom corner of the offset cell
     * @param {number} anchorBottom Used as a trick to show the user in front of the sprite.
     * @param {number} gapLeft Horizontal gap for the interaction with this sprite.
     * @param {number} cellOffsetX The cell offset of the sprite is not on the origin cell
     * @param {number} cellOffsetY The cell offset of the sprite is not on the origin cell
     * @param {boolean} leftLooking True if when the human interacts with this sprite, it has to look at the left.
     * @param {boolean} topLooking True if when the human interacts with this sprite, it has to look at the top.
     */
    constructor(
        spriteKey: string,
        entryPoints: DIRECTION[],
        left: number,
        bottom: number,
        anchorBottom: number,
        gapLeft: number,
        cellOffsetX: number,
        cellOffsetY: number,
        leftLooking: boolean,
        topLooking: boolean
    ) {
        this.spriteKey = spriteKey;
        this.entryPoints = entryPoints;
        this.left = left;
        this.bottom = bottom;
        this.anchorBottom = anchorBottom;
        this.gapLeft = gapLeft;
        this.cellOffset = new PIXI.Point(cellOffsetX, cellOffsetY);
        this.leftLooking = leftLooking;
        this.topLooking = topLooking;
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

    getInteractionPosition(orientation: DIRECTION): PIXI.Point {
        return new PIXI.Point(
            ObjectOrientation.isHorizontalMirror(orientation) ? - (this.left + this.gapLeft) : (this.left + this.gapLeft),
            this.bottom - this.anchorBottom + 3
        );
    }

    getRealPositionFromOrigin(realPosition: PIXI.Point, orientation: DIRECTION, scale: number = 1) {
        return new PIXI.Point(
            realPosition.x + (ObjectOrientation.isHorizontalMirror(orientation) ? -1 : 1) * (this.left - (this.cellOffset.x - this.cellOffset.y) * CELL_WIDTH / 2) * scale,
            realPosition.y + this.bottom - this.anchorBottom - ((this.cellOffset.x + this.cellOffset.y) * CELL_HEIGHT / 2) * scale
        )
    }

    getAnchor(sprite: Phaser.Sprite): PIXI.Point {
        return new PIXI.Point(
            0.5,
            1.0 - this.anchorBottom / sprite.height
        );
    }

    getEntryPoints(orientation: DIRECTION): DIRECTION[] {
        if (!ObjectOrientation.isHorizontalMirror(orientation)) {
            return this.entryPoints;
        } else {
            return this.entryPoints.map((entryPoint) => {
                return Direction.getHorizontalMirror(entryPoint);
            });
        }
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

    isHumanTopLooking(): boolean {
        return this.topLooking;
    }

    /**
     * Returns true if the user looks to the left when he interacts with the object.
     * Returns false if the user looks to the right when he interacts with the object.
     *
     * @param {DIRECTION} orientation
     * @returns {boolean}
     */
    isHumanLeftLooking(orientation: DIRECTION): boolean {
        return ObjectOrientation.isHorizontalMirror(orientation) ? !this.leftLooking : this.leftLooking;
    }
}
