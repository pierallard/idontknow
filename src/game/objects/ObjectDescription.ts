import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";
import {ObjectOrientation} from "./ObjectOrientation";
import {InteractivePoint} from "./InteractivePoint";

export class ObjectDescription {
    private name: string;
    private minLevel: number;
    private occupiedCells: PIXI.Point[];
    private bottomOrientedSpriteInfos: SpriteInfo[];
    private topOrientedSpriteInfos: SpriteInfo[];
    private bottomInteractivePoints: InteractivePoint[];
    private topInteractivePoints: InteractivePoint[];
    private price: Price;
    private ambiance: number;
    private radius: number;

    constructor(
        name: string,
        minLevel: number,
        occupiedCells: PIXI.Point[],
        bottomOrientedSpriteInfos: SpriteInfo[],
        topOrientedSpriteInfos: SpriteInfo[],
        bottomInteractivePoints: InteractivePoint[],
        topInteractivePoints: InteractivePoint[],
        price: Price,
        ambiance: number = null,
        radius: number = 1
    ) {
        this.name = name;
        this.minLevel = minLevel;
        this.occupiedCells = occupiedCells;
        this.bottomOrientedSpriteInfos = bottomOrientedSpriteInfos;
        this.topOrientedSpriteInfos = topOrientedSpriteInfos;
        this.bottomInteractivePoints = bottomInteractivePoints;
        this.topInteractivePoints = topInteractivePoints;
        this.price = price;
        this.ambiance = ambiance;
        this.radius = radius;
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
        if (!ObjectOrientation.isHorizontalMirror(orientation)) {
            if (!ObjectOrientation.isVerticalMirror(orientation)) {
                return this.occupiedCells;
            } else {
                return this.occupiedCells.map((cell) => {
                    return new PIXI.Point(cell.y, cell.x);
                });
            }
        } else {
            if (!ObjectOrientation.isVerticalMirror(orientation)) {
                return this.occupiedCells.map((cell) => {
                    return new PIXI.Point(cell.y, cell.x);
                });
            } else {
                return this.occupiedCells;
            }
        }
    }

    canBeTopOriented(): boolean {
        return this.topOrientedSpriteInfos.length > 0;
    }

    getMinLevel(): number {
        return this.minLevel;
    }

    getRadius(): number {
        return this.radius;
    }

    getAmbiance(): number {
        return this.ambiance;
    }
}
