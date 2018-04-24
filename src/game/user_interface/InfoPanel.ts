import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";
import {Employee} from "../human_stuff/Employee";
import {TEXT_STYLE} from "../TextStyle";
import {COLOR} from "../Pico8Colors";

const HEIGHT = 80;
const GRAPH_GAP = 2;

export class InfoPanel {
    private worldKnowledge: WorldKnowledge;
    private moods: Phaser.Graphics;
    private visible: boolean;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GRAPH_GAP;
        const top = TOP_GAP;
        this.moods = game.add.graphics(left, top, groups[GROUP_INTERFACE]);
    }

    update() {
        const graphWidth = INTERFACE_WIDTH - 2 * GRAPH_GAP;
        const lastMoods = this.worldKnowledge.getLastMoods();
        this.moods.clear();
        this.moods.lineStyle(1, COLOR.WHITE);
        this.moods.moveTo(0, 0);
        this.moods.lineTo(0, HEIGHT);
        this.moods.lineTo(graphWidth, HEIGHT);

        this.moods.moveTo(graphWidth, HEIGHT - lastMoods[0] * HEIGHT);
        for (let i = 1; i < lastMoods.length; i++) {
            this.moods.lineTo(graphWidth - i, HEIGHT - lastMoods[i] * HEIGHT);
        }
    }

    show() {
        if (!this.visible) {
            this.moods.position.x -= INTERFACE_WIDTH;
        }
        this.visible = true;
    }

    hide() {
        if (this.visible) {
            this.moods.position.x += INTERFACE_WIDTH;
        }
        this.visible = false;
    }
}
