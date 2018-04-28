import {EMPLOYEE_TYPE} from "./human_stuff/HumanPropertiesFactory";
import {SmoothValue} from "./SmoothValue";

const DEVELOPER_RATIO = 1000;
const MARKETING_RATIO = 5;
const SALE_RATIO = 10;

export class LevelManager {
    private level: number;
    private goals: {[index: number] : number};
    private starts: {[index: number] : number};
    private levels: {[index: number] : SmoothValue};

    constructor() {
        this.level = 1;
        this.goals = {};
        this.starts = {};

        this.starts[EMPLOYEE_TYPE.DEVELOPER] = 0;
        this.starts[EMPLOYEE_TYPE.MARKETING] = 0;
        this.starts[EMPLOYEE_TYPE.SALE] = 0;

        this.goals[EMPLOYEE_TYPE.DEVELOPER] = DEVELOPER_RATIO;
        this.goals[EMPLOYEE_TYPE.MARKETING] = MARKETING_RATIO;
        this.goals[EMPLOYEE_TYPE.SALE] = SALE_RATIO;

        this.levels = {};
        this.levels[EMPLOYEE_TYPE.DEVELOPER] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.MARKETING] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.SALE] = new SmoothValue(0);
    }

    getLevelProgress(type: EMPLOYEE_TYPE): number {
        return Math.min((this.levels[type].getValue() - this.starts[type]) / (this.goals[type] - this.starts[type]), 1);
    }

    getLevelValue(type: EMPLOYEE_TYPE): number {
        return this.levels[type].getValue();
    }

    getGoal(type: EMPLOYEE_TYPE): number {
        return this.goals[type];
    }

    addLevelProgress(type: EMPLOYEE_TYPE, value: number, time: number) {
        let realValue = 0;
        switch (type) {
            case EMPLOYEE_TYPE.DEVELOPER: realValue = value * DEVELOPER_RATIO / 10; break;
            case EMPLOYEE_TYPE.MARKETING: realValue = value * MARKETING_RATIO / 10; break;
            case EMPLOYEE_TYPE.SALE: realValue = value * SALE_RATIO / 10; break;
        }
        this.levels[type].add(realValue, time);
    }

    update() {
        if (this.levels[EMPLOYEE_TYPE.DEVELOPER].getValue() >= this.goals[EMPLOYEE_TYPE.DEVELOPER] &&
            this.levels[EMPLOYEE_TYPE.MARKETING].getValue() >= this.goals[EMPLOYEE_TYPE.MARKETING] &&
            this.levels[EMPLOYEE_TYPE.SALE].getValue() >= this.goals[EMPLOYEE_TYPE.SALE]) {
            this.starts[EMPLOYEE_TYPE.DEVELOPER] = this.goals[EMPLOYEE_TYPE.DEVELOPER];
            this.starts[EMPLOYEE_TYPE.MARKETING] = this.goals[EMPLOYEE_TYPE.MARKETING];
            this.starts[EMPLOYEE_TYPE.SALE] = this.goals[EMPLOYEE_TYPE.SALE];
            this.level += 1;
            this.goals[EMPLOYEE_TYPE.DEVELOPER] = this.goals[EMPLOYEE_TYPE.DEVELOPER] * 2;
            this.goals[EMPLOYEE_TYPE.MARKETING] = this.goals[EMPLOYEE_TYPE.MARKETING] * 2;
            this.goals[EMPLOYEE_TYPE.SALE] = this.goals[EMPLOYEE_TYPE.SALE] * 2;
        }
    }

    getLevel(): number {
        return this.level;
    }
}
