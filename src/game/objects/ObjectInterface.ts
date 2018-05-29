import {DIRECTION} from "../Direction";
import {Point} from "../Point";

export interface ObjectInterface {
    getPositions(): Point[];
    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }): void;
    getEntries(objectNumber: number): DIRECTION[];
    getOrigin(): Point;
}
