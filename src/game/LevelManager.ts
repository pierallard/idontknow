import {EMPLOYEE_TYPE} from "./human_stuff/HumanPropertiesFactory";
import {SmoothValue} from "./SmoothValue";

export class LevelManager {
    private level: number;
    private goals: {[index: number] : number};
    private levels: {[index: number] : SmoothValue};

    constructor() {
        this.level = 1;
        this.goals = {};
        this.goals[EMPLOYEE_TYPE.DEVELOPER] = 10;
        this.goals[EMPLOYEE_TYPE.MARKETING] = 10;
        this.goals[EMPLOYEE_TYPE.SALE] = 10;

        this.levels = {};
        this.levels[EMPLOYEE_TYPE.DEVELOPER] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.MARKETING] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.SALE] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.DEVELOPER].setMaxValue(this.goals[EMPLOYEE_TYPE.DEVELOPER]);
        this.levels[EMPLOYEE_TYPE.MARKETING].setMaxValue(this.goals[EMPLOYEE_TYPE.MARKETING]);
        this.levels[EMPLOYEE_TYPE.SALE].setMaxValue(this.goals[EMPLOYEE_TYPE.SALE]);
    }

    getLevelProgress(type: EMPLOYEE_TYPE): number {
        return this.levels[type].getValue() / this.goals[type];
    }

    addLevelProgress(type: EMPLOYEE_TYPE, value: number) {
        this.levels[type].add(value, Phaser.Timer.SECOND * 5);
    }

    update() {
        if (this.levels[EMPLOYEE_TYPE.DEVELOPER].getValue() >= this.goals[EMPLOYEE_TYPE.DEVELOPER] &&
            this.levels[EMPLOYEE_TYPE.MARKETING].getValue() >= this.goals[EMPLOYEE_TYPE.MARKETING] &&
            this.levels[EMPLOYEE_TYPE.SALE].getValue() >= this.goals[EMPLOYEE_TYPE.SALE]) {
            this.level += 1;
            this.levels[EMPLOYEE_TYPE.DEVELOPER].setInstantValue(0);
            this.levels[EMPLOYEE_TYPE.MARKETING].setInstantValue(0);
            this.levels[EMPLOYEE_TYPE.SALE].setInstantValue(0);
            this.goals[EMPLOYEE_TYPE.DEVELOPER] = this.goals[EMPLOYEE_TYPE.DEVELOPER] * 2;
            this.goals[EMPLOYEE_TYPE.MARKETING] = this.goals[EMPLOYEE_TYPE.MARKETING] * 2;
            this.goals[EMPLOYEE_TYPE.SALE] = this.goals[EMPLOYEE_TYPE.SALE] * 2;
            this.levels[EMPLOYEE_TYPE.DEVELOPER].setMaxValue(this.goals[EMPLOYEE_TYPE.DEVELOPER]);
            this.levels[EMPLOYEE_TYPE.MARKETING].setMaxValue(this.goals[EMPLOYEE_TYPE.MARKETING]);
            this.levels[EMPLOYEE_TYPE.SALE].setMaxValue(this.goals[EMPLOYEE_TYPE.SALE]);
        }
    }
}
