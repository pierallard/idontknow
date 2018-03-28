import {DIRECTION} from "../Direction";

export interface SittableInterface {
    getPosition(): PIXI.Point;
    getPositionGap(): PIXI.Point;
    getEntries(): DIRECTION[];
}