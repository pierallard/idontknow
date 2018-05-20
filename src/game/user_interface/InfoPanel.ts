import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {GROUP_INTERFACE} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {MoodSprite} from "../human_stuff/MoodSprite";
import {MEDIUM_GAP_BETWEEN_LINES, TEXT_STYLE} from "../TextStyle";
import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";

const HEIGHT = 80;
const GRAPH_GAP = 2;

export class InfoPanel {
    private worldKnowledge: WorldKnowledge;
    private moods: Phaser.Graphics;
    private employees: Phaser.Graphics;
    private visible: boolean;
    private softwarePrice: Phaser.Text;
    private developerCount: Phaser.Text;
    private salesCount: Phaser.Text;
    private marketingCount: Phaser.Text;
    private check: Phaser.Sprite;
    private ambiance: Phaser.Text;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GRAPH_GAP;
        const top = TOP_GAP + 100;
        this.softwarePrice = game.add.text(left, TOP_GAP + 3, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.developerCount = game.add.text(left, TOP_GAP + 3 + MEDIUM_GAP_BETWEEN_LINES, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.salesCount = game.add.text(left, TOP_GAP + 3 + MEDIUM_GAP_BETWEEN_LINES * 2, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.marketingCount = game.add.text(left, TOP_GAP + 3 + MEDIUM_GAP_BETWEEN_LINES * 3, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.check = game.add.sprite(left, TOP_GAP + MEDIUM_GAP_BETWEEN_LINES * 4 + 3, 'check', 0, groups[GROUP_INTERFACE]);
        this.ambiance = game.add.text(left + 7, TOP_GAP + 3 + MEDIUM_GAP_BETWEEN_LINES * 4, 'Ambiance'.toUpperCase(), TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.moods = game.add.graphics(left, top, groups[GROUP_INTERFACE]);
        this.employees = game.add.graphics(left, top + 100, groups[GROUP_INTERFACE]);

        this.check.anchor.set(0, 0);
        this.check.inputEnabled = true;
        this.check.input.pixelPerfectOver = true;
        this.check.input.pixelPerfectClick = true;
        this.check.input.useHandCursor = true;
        this.check.events.onInputDown.add(this.toggleAmbiance, this);
    }

    private toggleAmbiance() {
        if (this.worldKnowledge.getAmbianceDisplayed()) {
            this.check.loadTexture('check', 0);
        } else {
            this.check.loadTexture('check', 1);
        }
        this.worldKnowledge.setAmbianceDisplayed(!this.worldKnowledge.getAmbianceDisplayed());
    }

    update() {
        if (this.visible) {
            //const lastMoods = this.worldKnowledge.getLastMoods();
            //InfoPanel.drawChart(this.moods, [lastMoods], 1, [null]);
            const lastLevels = this.worldKnowledge.getLastEmployeesLevel();
            InfoPanel.drawChart(this.moods, lastLevels, null, [COLOR.LIGHT_GREEN, COLOR.RED, COLOR.ROSE]);

            const lastEmployees = this.worldKnowledge.getLastEmployeesCount();
            InfoPanel.drawChart(this.employees, lastEmployees, null, [COLOR.LIGHT_GREEN, COLOR.RED, COLOR.ROSE]);

            this.softwarePrice.setText('Software Price: '.toUpperCase() + this.worldKnowledge.getSoftwarePrice().getStringValue());
            this.developerCount.setText('Developers: '.toUpperCase() + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.DEVELOPER));
            this.salesCount.setText('Sales: '.toUpperCase() + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.SALE));
            this.marketingCount.setText('Marketing: '.toUpperCase() + this.worldKnowledge.getEmployeeCount(EMPLOYEE_TYPE.MARKETING));
        }
    }

    show() {
        if (!this.visible) {
            this.moods.position.x -= INTERFACE_WIDTH;
            this.employees.position.x -= INTERFACE_WIDTH;
            this.softwarePrice.position.x -= INTERFACE_WIDTH;
            this.developerCount.position.x -= INTERFACE_WIDTH;
            this.salesCount.position.x -= INTERFACE_WIDTH;
            this.marketingCount.position.x -= INTERFACE_WIDTH;
            this.check.position.x -= INTERFACE_WIDTH;
            this.ambiance.position.x -= INTERFACE_WIDTH;
        }
        this.visible = true;
    }

    hide() {
        if (this.visible) {
            this.moods.position.x += INTERFACE_WIDTH;
            this.employees.position.x += INTERFACE_WIDTH;
            this.softwarePrice.position.x += INTERFACE_WIDTH;
            this.developerCount.position.x += INTERFACE_WIDTH;
            this.salesCount.position.x += INTERFACE_WIDTH;
            this.marketingCount.position.x += INTERFACE_WIDTH;
            this.check.position.x += INTERFACE_WIDTH;
            this.ambiance.position.x += INTERFACE_WIDTH;
        }
        this.visible = false;
    }

    private static drawChart(graphics: Phaser.Graphics, valuesSet: number[][], max: number = null, colors: COLOR[] = []) {
        const graphWidth = INTERFACE_WIDTH - 2 * GRAPH_GAP;
        graphics.clear();

        graphics.lineStyle(1, COLOR.DARK_GREY);
        for (let i = 0; i < 10; i++) {
            graphics.moveTo(1, i * HEIGHT / 10);
            graphics.lineTo(graphWidth, i * HEIGHT / 10);
        }

        if (max === null || isNaN(max)) {
            max = this.getMaxFromValuesSet(valuesSet);
        }

        for (let v = 0; v < valuesSet.length; v++) {
            const values = valuesSet[v];
            if (colors[v]) {
                graphics.lineStyle(1, colors[v]);
            } else {
                graphics.lineStyle(1, MoodSprite.getColor(values[0]));
            }
            graphics.moveTo(graphWidth, HEIGHT - values[0] * HEIGHT / max);
            for (let i = 1; i < graphWidth; i++) {
                graphics.lineTo(graphWidth - i, HEIGHT - values[i] * HEIGHT / max);
                if (!colors[v]) {
                    graphics.lineStyle(1, MoodSprite.getColor(values[i]));
                }
            }
        }

        graphics.lineStyle(1, COLOR.WHITE);
        graphics.moveTo(0, 0);
        graphics.lineTo(0, HEIGHT);
        graphics.lineTo(graphWidth, HEIGHT);
    }

    private static getMaxFromValuesSet(valuesSet: number[][]) {
        let result = 0;
        valuesSet.forEach((values) => {
            values.forEach((value) => {
                if (value !== undefined) {
                    result = Math.max(result, value);
                }
            })
        });

        return result;
    }
}
