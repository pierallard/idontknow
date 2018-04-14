import {DIRECTION} from "../Direction";
import {Price} from "./Price";

export interface ObjectInterface {
    getPosition(): any;
    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }): void;
    getEntries(): DIRECTION[];
}
