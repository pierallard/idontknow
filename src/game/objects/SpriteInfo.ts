import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {Direction, DIRECTION} from "../Direction";
import {ObjectOrientation} from "./ObjectOrientation";

export class SpriteInfo {
    private name: string;
    private left: number;
    private bottom: number;
    private anchorBottom: number;
    private gapLeft: number;
    private entryPoints: DIRECTION[];
    private cellGap: PIXI.Point;
    private topOriented: boolean;
    private leftOriented: boolean;

    constructor(
        name: string,
        entryPoints: DIRECTION[],
        left: number,
        bottom: number,
        anchorBottom: number,
        gapLeft: number,
        cellGapX: number,
        cellGapY: number,
        leftOriented: boolean,
        topOriented: boolean
    ) {
        this.name = name;
        this.entryPoints = entryPoints;
        this.left = left;
        this.bottom = bottom;
        this.anchorBottom = anchorBottom;
        this.gapLeft = gapLeft;
        this.cellGap = new PIXI.Point(cellGapX, cellGapY);
        this.leftOriented = leftOriented;
        this.topOriented = topOriented;
    }

    getSpriteName(): string {
        return this.name;
    }

    getAnchorBottom() {
        return this.anchorBottom;
    }

    getRealPosition(position: PIXI.Point, orientation: DIRECTION): PIXI.Point {
        return this.getRealPositionFromOrigin(PositionTransformer.getRealPosition(position), orientation);
    }

    getSittablePosition(orientation: DIRECTION): PIXI.Point {
        return new PIXI.Point(
            ObjectOrientation.isLeftOriented(orientation) ? - (this.left + this.gapLeft) : (this.left + this.gapLeft),
            this.bottom - this.anchorBottom + 3
        );
    }

    getRealPositionFromOrigin(spriteSource: PIXI.Point, orientation: DIRECTION, scale: number = 1) {
        return new PIXI.Point(
            spriteSource.x + (ObjectOrientation.isLeftOriented(orientation) ? -1 : 1) * (this.left - (this.cellGap.x - this.cellGap.y) * CELL_WIDTH / 2) * scale,
            spriteSource.y + this.bottom - this.anchorBottom - ((this.cellGap.x + this.cellGap.y) * CELL_HEIGHT / 2) * scale
        )
    }

    getAnchor(sprite: Phaser.Sprite): PIXI.Point {
        return new PIXI.Point(
            0.5,
            1.0 - this.anchorBottom / sprite.height
        );
    }

    getEntryPoints(orientation: DIRECTION): DIRECTION[] {
        if (!ObjectOrientation.isLeftOriented(orientation)) {
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
    getPositionGapFromOrigin(orientation: DIRECTION): PIXI.Point {
        if (!ObjectOrientation.isLeftOriented(orientation)) {
            return this.cellGap;
        } else {
            return new PIXI.Point(this.cellGap.y, this.cellGap.x)
        }
    }

    getTopOrientation(): boolean {
        return this.topOriented;
    }

    /**
     * Returns false if the user looks to the right when he interacts with the object.
     * Returns true if the user looks to the left when he interacts with the object.
     *
     * @param {DIRECTION} orientation
     * @returns {boolean}
     */
    getOrientation(orientation: DIRECTION): boolean {
        return ObjectOrientation.isLeftOriented(orientation) ? !this.leftOriented : this.leftOriented;
    }
}
