import {PositionTransformer} from "../PositionTransformer";
import {Direction, DIRECTION} from "../Direction";

export class SpriteInfo {
    private name: string;
    private left: number;
    private bottom: number;
    private anchorBottom: number;
    private gapLeft: number;
    private entryPoints: DIRECTION[];
    private cellGap: PIXI.Point;

    constructor(
        name: string,
        entryPoints: DIRECTION[],
        left: number,
        bottom: number,
        anchorBottom: number,
        gapLeft: number,
        cellGapX: number,
        cellGapY: number
    ) {
        this.name = name;
        this.entryPoints = entryPoints;
        this.left = left;
        this.bottom = bottom;
        this.anchorBottom = anchorBottom;
        this.gapLeft = gapLeft;
        this.cellGap = new PIXI.Point(cellGapX, cellGapY);
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

    getRealPositionFromOrigin(spriteSource: PIXI.Point, leftOriented: boolean) {
        return new PIXI.Point(
            spriteSource.x + (leftOriented ? - this.left : this.left),
            spriteSource.y + this.bottom - this.anchorBottom
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

    getPositionGapFromOrigin(): PIXI.Point {
        return this.cellGap;
    }
}
