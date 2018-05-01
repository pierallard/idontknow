import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {MoodSprite} from "../human_stuff/MoodSprite";
import {TEXT_STYLE} from "../TextStyle";
import {GAP_BETWEEN_LINES} from "./UserInfoPanel";
import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";

const HEIGHT = 80;
const GRAPH_GAP = 2;

export class InfoPanel {
    private worldKnowledge: WorldKnowledge;
    private moods: Phaser.Graphics;
    private visible: boolean;
    private softwarePrice: Phaser.Text;
    private developerCount: Phaser.Text;
    private salesCount: Phaser.Text;
    private marketingCount: Phaser.Text;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GRAPH_GAP;
        const top = TOP_GAP + 100;
        this.softwarePrice = game.add.text(left, TOP_GAP, 'Software Price: ', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.developerCount = game.add.text(left, TOP_GAP + GAP_BETWEEN_LINES, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.salesCount = game.add.text(left, TOP_GAP + GAP_BETWEEN_LINES * 2, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.marketingCount = game.add.text(left, TOP_GAP + GAP_BETWEEN_LINES * 3, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.moods = game.add.graphics(left, top, groups[GROUP_INTERFACE]);
    }

    update() {
        if (this.visible) {
            const graphWidth = INTERFACE_WIDTH - 2 * GRAPH_GAP;
            const lastMoods = this.worldKnowledge.getLastMoods();
            this.moods.clear();
            this.moods.lineStyle(1, COLOR.WHITE);
            this.moods.moveTo(0, 0);
            this.moods.lineTo(0, HEIGHT);
            this.moods.lineTo(graphWidth, HEIGHT);

            this.moods.lineStyle(1, COLOR.DARK_GREY);
            for (let i = 0; i < 10; i++) {
                this.moods.moveTo(1, i * HEIGHT / 10);
                this.moods.lineTo(graphWidth, i * HEIGHT / 10);
            }

            this.moods.lineStyle(1, MoodSprite.getColor(lastMoods[0]));
            this.moods.moveTo(graphWidth, HEIGHT - lastMoods[0] * HEIGHT);
            for (let i = 1; i < graphWidth; i++) {
                this.moods.lineTo(graphWidth - i, HEIGHT - lastMoods[i] * HEIGHT);
                this.moods.lineStyle(1, MoodSprite.getColor(lastMoods[i]));
            }
            this.softwarePrice.setText('Software Price: ' + this.worldKnowledge.getSoftwarePrice().getStringValue());
            this.developerCount.setText('Developers: ' + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.DEVELOPER));
            this.salesCount.setText('Sales: ' + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.SALE));
            this.marketingCount.setText('Marketing: ' + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.MARKETING));
        }
    }

    show() {
        if (!this.visible) {
            this.moods.position.x -= INTERFACE_WIDTH;
            this.softwarePrice.position.x -= INTERFACE_WIDTH;
            this.developerCount.position.x -= INTERFACE_WIDTH;
            this.salesCount.position.x -= INTERFACE_WIDTH;
            this.marketingCount.position.x -= INTERFACE_WIDTH;
        }
        this.visible = true;
    }

    hide() {
        if (this.visible) {
            this.moods.position.x += INTERFACE_WIDTH;
            this.softwarePrice.position.x += INTERFACE_WIDTH;
            this.developerCount.position.x += INTERFACE_WIDTH;
            this.salesCount.position.x += INTERFACE_WIDTH;
            this.marketingCount.position.x += INTERFACE_WIDTH;
        }
        this.visible = false;
    }
}
