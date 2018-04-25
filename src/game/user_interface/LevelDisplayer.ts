import {WorldKnowledge} from "../WorldKnowledge";
import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";
import {COLOR} from "../Pico8Colors";
import {Gauge} from "./Gauge";

const GAP = 3;
const TOP = 12;

export class LevelDisplayer {
    private worldKnowledge: WorldKnowledge;
    private gauges: Object;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.gauges = {};
        const width = Math.floor((INTERFACE_WIDTH - 4 * GAP) / 3);
        this.gauges[EMPLOYEE_TYPE.DEVELOPER] = new Gauge(new PIXI.Point(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GAP, TOP), width, COLOR.LIGHT_GREEN);
        this.gauges[EMPLOYEE_TYPE.SALE] = new Gauge(new PIXI.Point(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GAP + width + GAP, TOP), width, COLOR.RED);
        this.gauges[EMPLOYEE_TYPE.MARKETING] = new Gauge(new PIXI.Point(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + GAP + width + GAP + width + GAP, TOP), width, COLOR.ROSE);
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.gauges[EMPLOYEE_TYPE.DEVELOPER].create(game, groups);
        this.gauges[EMPLOYEE_TYPE.SALE].create(game, groups);
        this.gauges[EMPLOYEE_TYPE.MARKETING].create(game, groups);
    }

    update() {
        this.gauges[EMPLOYEE_TYPE.DEVELOPER].setValue(this.worldKnowledge.getLevelProgress(EMPLOYEE_TYPE.DEVELOPER));
        this.gauges[EMPLOYEE_TYPE.SALE].setValue(this.worldKnowledge.getLevelProgress(EMPLOYEE_TYPE.SALE));
        this.gauges[EMPLOYEE_TYPE.MARKETING].setValue(this.worldKnowledge.getLevelProgress(EMPLOYEE_TYPE.MARKETING));
        this.gauges[EMPLOYEE_TYPE.DEVELOPER].update();
        this.gauges[EMPLOYEE_TYPE.SALE].update();
        this.gauges[EMPLOYEE_TYPE.MARKETING].update();
    }
}
