import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";
import {Employee} from "../human_stuff/Employee";
import {TEXT_STYLE} from "../TextStyle";
import {MOOD} from "../human_stuff/HumanMoodManager";
import {Camembert} from "../Camembert";

const HEIGHT = 80;
const GRAPH_GAP = 2;

export class UserInfoPanel {
    private worldKnowledge: WorldKnowledge;
    private visible: boolean;
    private employeeName: Phaser.Text;
    private moodRelaxationText: Phaser.Text;
    private moodHungerText: Phaser.Text;
    private moodSocialText: Phaser.Text;
    private human: Employee;
    private camembert: Camembert;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
        this.camembert = new Camembert();
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GRAPH_GAP;
        const top = TOP_GAP;
        const gap = 10;
        this.employeeName = game.add.text(left, top, '', TEXT_STYLE);
        this.moodRelaxationText = game.add.text(left, top + gap, 'Relax', TEXT_STYLE);
        this.moodHungerText = game.add.text(left, top + 2 * gap, 'Hunger', TEXT_STYLE);
        this.moodSocialText = game.add.text(left, top + 3 * gap, 'Social', TEXT_STYLE);

        this.camembert.create(game, groups);
    }

    update() {
        if (this.human) {
            this.moodRelaxationText.setText('Relax  ' + UserInfoPanel.getPercentageStr(this.human.getMood(MOOD.RELAXATION)));
            this.moodHungerText.setText('Hunger ' + UserInfoPanel.getPercentageStr(this.human.getMood(MOOD.HUNGER)));
            this.moodSocialText.setText('Social ' + UserInfoPanel.getPercentageStr(this.human.getMood(MOOD.SOCIAL)));
            this.camembert.update();
        }
    }

    private static getPercentageStr(percentage: number): string {
        return Math.round(percentage * 100) + '%';
    }

    show() {
        if (!this.visible) {
            this.employeeName.position.x -= INTERFACE_WIDTH;
            this.camembert.show();
            this.moodRelaxationText.position.x -= INTERFACE_WIDTH;
            this.moodHungerText.position.x -= INTERFACE_WIDTH;
            this.moodSocialText.position.x -= INTERFACE_WIDTH;
        }
        this.visible = true;
    }

    hide() {
        if (this.visible) {
            this.employeeName.position.x += INTERFACE_WIDTH;
            this.camembert.hide();
            this.moodRelaxationText.position.x += INTERFACE_WIDTH;
            this.moodHungerText.position.x += INTERFACE_WIDTH;
            this.moodSocialText.position.x += INTERFACE_WIDTH;
        }
        this.visible = false;
    }

    showEmployeeInfoPanelForYohan(human: Employee) {
        this.human = human;
        this.employeeName.setText(human.getName());
        this.camembert.setHuman(human);
    }
}
