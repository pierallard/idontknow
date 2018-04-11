import {GROUP_INTERFACE} from "../game_state/Play";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";
import {OBJECT_SELLER_CELL_SIZE, ObjectSeller} from "./ObjectSeller";
import {WorldKnowledge} from "../WorldKnowledge";

export const INTERFACE_WIDTH = 100;

export class UserInterface {
    private backgroundGraphics: Phaser.Graphics;
    private objectSeller: ObjectSeller;

    constructor(worldKnowledge: WorldKnowledge) {
        this.objectSeller = new ObjectSeller(worldKnowledge);
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const interfaceGroup = groups[GROUP_INTERFACE];
        this.backgroundGraphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, 0, interfaceGroup);
        this.backgroundGraphics.beginFill(0x272a60);
        this.backgroundGraphics.drawRect(0, 0, INTERFACE_WIDTH, CAMERA_HEIGHT_PIXELS);
        interfaceGroup.add(this.backgroundGraphics);

        for (let i = 0; i < 10; i++) {
            this.backgroundGraphics.endFill();
            this.backgroundGraphics.lineStyle(1, 0xffffff);
            this.backgroundGraphics.drawRect(0, 10 + i * OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);
        }

        this.objectSeller.create(game, interfaceGroup);
    }

    update() {
        this.objectSeller.update();
    }
}
