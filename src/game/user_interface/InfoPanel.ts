import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";
// import game = PIXI.game;
import {TEXT_STYLE} from "../TextStyle";
import {OBJECT_SELLER_CELL_SIZE} from "./ObjectSeller";

const HEIGHT = 80;

export class InfoPanel {
    private worldKnowledge: WorldKnowledge;
    private moods: Phaser.Graphics;
    private moneyCounter: Phaser.Text;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP;
        this.moods = game.add.graphics(left, top, groups[GROUP_INTERFACE]);

        this.moneyCounter = game.add.text(
            left + 2,
            top,
            this.worldKnowledge.getMoneyInWallet().getStringValue(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );
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
        this.moneyCounter.setText(this.worldKnowledge.getMoneyInWallet().getStringValue());
    }

    show() {
        this.moneyCounter.position.x = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + 2;
    }

    hide() {
        this.moneyCounter.position.x = CAMERA_WIDTH_PIXELS + 5;
    }
}