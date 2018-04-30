import {Direction, DIRECTION} from "../Direction";
import {ObjectOrientation} from "./ObjectOrientation";

export class InteractivePoint {
    private entryPoints: DIRECTION[];
    private gap: PIXI.Point;
    private cellOffset: PIXI.Point;
    private leftLooking: boolean;
    private topLooking: boolean;

    constructor(entryPoints: DIRECTION[],
                gap: PIXI.Point = new PIXI.Point(0, 0),
                cellOffset: PIXI.Point = new PIXI.Point(0, 0),
                leftLooking: boolean = false,
                topLooking: boolean = false) {
        this.entryPoints = entryPoints;
        this.gap = gap;
        this.cellOffset = cellOffset;
        this.leftLooking = leftLooking;
        this.topLooking = topLooking;
    }

    /**
     * Returns the gap from the cell where the sprite is set.
     *
     * @param {DIRECTION} orientation
     * @returns {PIXI.Point}
     */
    getInteractionPosition(orientation: DIRECTION): PIXI.Point {
        return new PIXI.Point(
            (ObjectOrientation.isHorizontalMirror(orientation) ? -1 : 1) * (this.gap.x),
            this.gap.y
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