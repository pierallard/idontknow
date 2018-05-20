import {DIRECTION} from "../Direction";
import {ObjectInterface} from "./ObjectInterface";
import {ObjectReferer} from "./ObjectReferer";
import {Employee} from "../human_stuff/Employee";
import {ObjectDescription} from "./ObjectDescription";

export interface InteractiveObjectInterface extends ObjectInterface {
    getEntries(objectNumber: number): DIRECTION[];

    /**
     * Returns true if the human has to be right-sided, false if the human has to be left-sided, null if don't care.
     * @returns {boolean}
     */
    forceLeftOrientation(interactivePointIdentifier: number): boolean;

    /**
     * Returns true if the human has to be top-sided, false if the human has to be bottom-sided, null if don't care.
     */
    forceTopOrientation(interactivePointIdentifier: number): boolean;

    isUsed(interactivePointIdentifier: number): boolean;

    /**
     * Returns the gap for the human to interact with it.
     * For y value: -10px implies the human will be placed 10 px on the TOP direction (has to go up to 10 pixels) from
     * the bottom of the cell.
     *
     * @returns {PIXI.Point}
     */
    getPositionGap(interactivePointIdentifier: number): PIXI.Point;

    getCellPositionSubObject(interactivePointIdentifier: number): PIXI.Point;

    setUsed(interactivePointIdentifier: number, human: Employee): void;

    setUnused(interactivePointIdentifier: number): void;

    getUnusedReferers(): ObjectReferer[];

    getOrientation(): DIRECTION;

    getDescription(): ObjectDescription;

    getName(): string;
}
