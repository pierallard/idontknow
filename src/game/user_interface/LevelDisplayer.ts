import {WorldKnowledge} from "../WorldKnowledge";
import {GROUP_INTERFACE} from "../game_state/Play";
import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";

const BAR_HEIGHT = 10;
const GAP = 3;
const TOP = 12;

export class LevelDisplayer {
    private worldKnowledge: WorldKnowledge;
    private graphics: Phaser.Graphics;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.graphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, TOP, groups[GROUP_INTERFACE]);
        this.update();
    }

    update() {
        const width = Math.floor((INTERFACE_WIDTH - 4 * GAP) / 3);
        this.graphics.clear();

        [EMPLOYEE_TYPE.DEVELOPER, EMPLOYEE_TYPE.SALE, EMPLOYEE_TYPE.MARKETING].forEach((type, i) => {
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0xff0000);
            this.graphics.drawRect(GAP + i * (width + GAP), 0.5, width * this.worldKnowledge.getLevelProgress(type), BAR_HEIGHT);
            this.graphics.endFill();
            this.graphics.lineStyle(1, 0xffffff);
            this.graphics.drawRect(GAP + i * (width + GAP), 0.5, width, BAR_HEIGHT);
        });
    }
}