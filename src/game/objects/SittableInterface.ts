import {DIRECTION} from "../Direction";

export interface SittableInterface {
    getPosition(): PIXI.Point;

    /**
     * Returns the gap for the human to sit on it.
     * For y value: -10px implies the human will be placed 10 px on the TOP direction (has to go up to 10 pixels) from
     * the bottom of the cell.
     *
     * @returns {PIXI.Point}
     */
    getPositionGap(): PIXI.Point;
    getEntries(): DIRECTION[];
}