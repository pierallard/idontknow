import {DIRECTION} from "../Direction";
import {ObjectInterface} from "./ObjectInterface";

export interface InteractiveObjectInterface extends ObjectInterface {
    /**
     * Returns the gap for the human to interact with it.
     * For y value: -10px implies the human will be placed 10 px on the TOP direction (has to go up to 10 pixels) from
     * the bottom of the cell.
     *
     * @returns {PIXI.Point}
     */
    getPositionGap(): PIXI.Point;
    getEntries(): DIRECTION[];

    /**
     * Returns true if the human has to be right-sided, false if the human has to be left-sided, null if percentage.
     * @returns {boolean}
     */
    forceOrientation(): boolean;
}
