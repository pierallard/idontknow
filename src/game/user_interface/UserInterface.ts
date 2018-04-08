import {GROUP_INTERFACE} from "../game_state/Play";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";

export const INTERFACE_WIDTH = 100;

export class UserInterface {
    private backgroundGraphics: Phaser.Graphics;

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const interfaceGroup = groups[GROUP_INTERFACE];
        this.backgroundGraphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, 0, interfaceGroup);
        this.backgroundGraphics.beginFill(0x272a60);
        this.backgroundGraphics.drawRect(0, 0, INTERFACE_WIDTH, CAMERA_HEIGHT_PIXELS);
        interfaceGroup.add(this.backgroundGraphics);
    }
}