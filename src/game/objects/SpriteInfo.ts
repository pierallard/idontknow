import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {Direction, DIRECTION} from "../Direction";

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

    getRealPosition(position: PIXI.Point, leftOriented: boolean): PIXI.Point {
        return this.getRealPositionFromOrigin(PositionTransformer.getRealPosition(position), leftOriented);
    }

    getSittablePosition(leftOriented: boolean): PIXI.Point {
        return new PIXI.Point(
            leftOriented ? - (this.left + this.gapLeft) : (this.left + this.gapLeft),
            this.bottom - this.anchorBottom + 3
        );
    }

    getRealPositionFromOrigin(spriteSource: PIXI.Point, leftOriented: boolean, scale: number = 1) {
        return new PIXI.Point(
            spriteSource.x + (leftOriented ? -1 : 1) * (this.left - (this.cellGap.x - this.cellGap.y) * CELL_WIDTH / 2) * scale,
            spriteSource.y + this.bottom - this.anchorBottom - ((this.cellGap.x + this.cellGap.y) * CELL_HEIGHT / 2) * scale
        )
    }

    getAnchor(sprite: Phaser.Sprite): PIXI.Point {
        return new PIXI.Point(
            0.5,
            1.0 - this.anchorBottom / sprite.height
        );
    }

    getEntryPoints(leftOriented: boolean): DIRECTION[] {
        if (!leftOriented) {
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
     * @param {boolean} leftOriented
     * @returns {PIXI.Point}
     */
    getPositionGapFromOrigin(leftOriented: boolean): PIXI.Point {
        if (!leftOriented) {
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
     * @param {boolean} leftOriented
     * @returns {boolean}
     */
    getOrientation(leftOriented: boolean): boolean {
        return leftOriented ? !this.leftOriented : this.leftOriented;
    }
}
