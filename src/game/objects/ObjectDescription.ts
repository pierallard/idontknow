import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";
import {ObjectOrientation} from "./ObjectOrientation";
import {InteractivePoint} from "./InteractivePoint";

export class ObjectDescription {
    private name: string;
    private bottomOrientedSpriteInfos: SpriteInfo[];
    private topOrientedSpriteInfos: SpriteInfo[];
    private bottomInteractivePoints: InteractivePoint[];
    private topInteractivePoints: InteractivePoint[];
    private price: Price;

    constructor(
        name: string,
        bottomOrientedSpriteInfos: SpriteInfo[],
        topOrientedSpriteInfos: SpriteInfo[],
        bottomInteractivePoints: InteractivePoint[],
        topInteractivePoints: InteractivePoint[],
        price: Price
    ) {
        this.name = name;
        this.bottomOrientedSpriteInfos = bottomOrientedSpriteInfos;
        this.topOrientedSpriteInfos = topOrientedSpriteInfos;
        this.bottomInteractivePoints = bottomInteractivePoints;
        this.topInteractivePoints = topInteractivePoints;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(orientation: DIRECTION): SpriteInfo[] {
        return ObjectOrientation.isVerticalMirror(orientation)
            ? this.topOrientedSpriteInfos
            : this.bottomOrientedSpriteInfos;
    }

    getSpriteInfo(orientation: DIRECTION, objectOrder: number): SpriteInfo {
        return this.getSpriteInfos(orientation)[objectOrder];
    }

    getInteractivePoints(orientation: DIRECTION): InteractivePoint[] {
        return ObjectOrientation.isVerticalMirror(orientation)
            ? this.topInteractivePoints
            : this.bottomInteractivePoints;
    }

    getInteractivePointEntryPoints(orientation: DIRECTION, interactivePointIdentifier: number): DIRECTION[] {
        return this.getInteractivePoints(orientation)[interactivePointIdentifier].getEntryPoints(orientation);
    }

    getInteractivePointCellOffset(orientation: DIRECTION, interactivePointIdentifier: number): PIXI.Point {
        return this.getInteractivePoints(orientation)[interactivePointIdentifier].getCellOffset(orientation);
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
        this.getInteractivePoints(orientation).forEach((interactivePoint) => {
            interactivePoint.getEntryPoints(orientation).forEach((entryPoint) => {
                const gap = interactivePoint.getCellOffset(orientation);
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
