import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";

const HEIGHT = 100;

export class InfoPanel {
    private worldKnowledge: WorldKnowledge;
    private moods: Phaser.Graphics;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP;
        this.moods = game.add.graphics(left, top, groups[GROUP_INTERFACE]);
    }

    update() {
        const lastMoods = this.worldKnowledge.getLastMoods();
        this.moods.clear();
        this.moods.lineStyle(1, 0xffffff);
        this.moods.moveTo(0, 0);
        this.moods.lineTo(0, HEIGHT);
        this.moods.lineTo(INTERFACE_WIDTH, HEIGHT);
        
        this.moods.moveTo(INTERFACE_WIDTH, HEIGHT - lastMoods[0] * HEIGHT);
        for (let i = 1; i < lastMoods.length; i++) {
            this.moods.lineTo(INTERFACE_WIDTH - i, HEIGHT - lastMoods[i] * HEIGHT);
        }
    }

    show() {

    }

    hide() {

    }
}