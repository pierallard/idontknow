import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";
import {ObjectOrientation} from "./ObjectOrientation";

export class ObjectInfo {
    private name: string;
    private bottomOrientedSpriteInfos: SpriteInfo[];
    private topOrientedSpriteInfos: SpriteInfo[];
    private price: Price;

    constructor(
        name: string,
        bottomOrientedSpriteInfos: SpriteInfo[],
        topOrientedSpriteInfos: SpriteInfo[],
        price: Price
    ) {
        this.name = name;
        this.bottomOrientedSpriteInfos = bottomOrientedSpriteInfos;
        this.topOrientedSpriteInfos = topOrientedSpriteInfos;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(orientation: DIRECTION) {
        return ObjectOrientation.isVerticalMirror(orientation)
            ? this.topOrientedSpriteInfos
            : this.bottomOrientedSpriteInfos;
    }

    getSpriteInfo(orientation: DIRECTION, objectOrder: number): SpriteInfo {
        return this.getSpriteInfos(orientation)[objectOrder];
    }

    getEntryPoints(orientation: DIRECTION, objectNumber: number): DIRECTION[] {
        return this.getSpriteInfo(orientation, objectNumber).getEntryPoints(orientation);
    }

    getSpriteCellOffset(orientation: DIRECTION, subObjectNumber: number): PIXI.Point {
        return this.getSpriteInfo(orientation, subObjectNumber).getCellOffset(orientation);
    }

    isSalable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }

    /**
     * Returns the list of the cell offsets for this object. If there is a single sprite, it will return no gap,
     * i.e. [(0,0)].
     * @param {DIRECTION} orientation
     * @returns {PIXI.Point[]}
     */
    getUniqueCellOffsets(orientation: DIRECTION): PIXI.Point[] {
        let result = [];
        this.getSpriteInfos(orientation).forEach((spriteInfo) => {
            const newGap = spriteInfo.getCellOffset(orientation);
            let found = false;
            result.forEach((previousGap) => {
                found = found || (previousGap.x === newGap.x && previousGap.y === newGap.y);
            });
            if (!found) {
                result.push(newGap);
            }
        });

        return result;
    }

    /**
     * Returns the list of all the entry cells of this object.
     * @param {PIXI.Point} originCell
     * @param {DIRECTION} orientation
     * @returns {PIXI.Point[]}
     */
    getEntryCells(originCell: PIXI.Point, orientation: DIRECTION): PIXI.Point[] {
        let result = [];
        this.getSpriteInfos(orientation).forEach((spriteInfo) => {
            spriteInfo.getEntryPoints(orientation).forEach((entryPoint) => {
                const gap = spriteInfo.getCellOffset(orientation);
                const spriteCell = new PIXI.Point(
                    originCell.x + gap.x,
                    originCell.y + gap.y
                );
                result.push(Direction.getNeighbor(spriteCell, entryPoint));
            });
        });

        return result;
    }

    canBeTopOriented() {
        return this.topOrientedSpriteInfos.length > 0;
    }
}
