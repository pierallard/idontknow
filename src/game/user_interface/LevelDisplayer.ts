import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";
import {COLOR} from "../Pico8Colors";
import {Gauge} from "./Gauge";
import {Tooltip, Tooltipable} from "./Tooltip";

const GAP = 3;
const TOP = 12;

export class LevelDisplayer implements Tooltipable {
    private worldKnowledge: WorldKnowledge;
    private gauges: {[index: number]: Gauge};
    private tooltips: {[index: number]: Tooltip};

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.gauges = {};
        this.tooltips = {};
        const width = Math.floor((INTERFACE_WIDTH - 4 * GAP) / 3);

        this.gauges[EMPLOYEE_TYPE.DEVELOPER] = new Gauge(width, COLOR.LIGHT_GREEN);
        this.gauges[EMPLOYEE_TYPE.SALE] = new Gauge(width, COLOR.RED);
        this.gauges[EMPLOYEE_TYPE.MARKETING] = new Gauge(width, COLOR.ROSE);

        this.tooltips[EMPLOYEE_TYPE.DEVELOPER] = new Tooltip(() => {
            return Math.floor(this.worldKnowledge.getLevelValue(EMPLOYEE_TYPE.DEVELOPER)) + '/' + this.worldKnowledge.getLevelGoal(EMPLOYEE_TYPE.DEVELOPER) + ' lines coded';
        });
        this.tooltips[EMPLOYEE_TYPE.SALE] = new Tooltip(() => {
            return Math.floor(this.worldKnowledge.getLevelValue(EMPLOYEE_TYPE.SALE)) + '/' + this.worldKnowledge.getLevelGoal(EMPLOYEE_TYPE.SALE) + ' licence sell'
        });
        this.tooltips[EMPLOYEE_TYPE.MARKETING] = new Tooltip(() => {
            return Math.floor(this.worldKnowledge.getLevelValue(EMPLOYEE_TYPE.MARKETING)) + '/' + this.worldKnowledge.getLevelGoal(EMPLOYEE_TYPE.MARKETING) + ' campaigns done';
        });
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        const width = Math.floor((INTERFACE_WIDTH - 4 * GAP) / 3);
        for (let i = 0; i < Object.keys(this.gauges).length; i++) {
            this.gauges[Object.keys(this.gauges)[i]].create(
                game,
                groups,
                new PIXI.Point(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GAP + (width + GAP) * i, TOP)
            );
        }
        Object.keys(this.tooltips).forEach((employeeType) => {
            this.tooltips[employeeType].create(game, groups);
            this.tooltips[employeeType].setInput(this, this.gauges[parseInt(employeeType)].getGraphics());
        });

    }

    update() {
        Object.keys(this.gauges).forEach((employeeType) => {
            if (this.worldKnowledge.getLevelGoal(<EMPLOYEE_TYPE> parseInt(employeeType)) <= 0) {
                this.gauges[employeeType].hide();
            }
            else {
                this.gauges[employeeType].show();
            }
            this.gauges[employeeType].setValue(this.worldKnowledge.getLevelProgress(<EMPLOYEE_TYPE> parseInt(employeeType)));
            this.gauges[employeeType].update();
        });
        Object.keys(this.tooltips).forEach((employeeType) => {
            this.tooltips[employeeType].update();
        })
    }
}
