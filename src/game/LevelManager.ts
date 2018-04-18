import {EMPLOYEE_TYPE} from "./human_stuff/HumanPropertiesFactory";

export class LevelManager {
    private level: number;
    private goals: {[index: number] : number};
    private levels: {[index: number] : number};

    constructor() {
        this.level = 1;
        this.goals = {};
        this.goals[EMPLOYEE_TYPE.DEVELOPER] = 10;
        this.goals[EMPLOYEE_TYPE.MARKETING] = 10;
        this.goals[EMPLOYEE_TYPE.SALE] = 10;

        this.levels = {};
        this.levels[EMPLOYEE_TYPE.DEVELOPER] = 0;
        this.levels[EMPLOYEE_TYPE.MARKETING] = 0;
        this.levels[EMPLOYEE_TYPE.SALE] = 0;
    }

    getLevelProgress(type: EMPLOYEE_TYPE): number {
        return this.levels[type] / this.goals[type];
    }

    addLevelProgress(type: EMPLOYEE_TYPE, value: number) {
        this.levels[type] = Math.min(this.levels[type] + value, this.goals[type]);
        this.checkLevel();
    }

    private checkLevel() {
        if (this.levels[EMPLOYEE_TYPE.DEVELOPER] >= this.goals[EMPLOYEE_TYPE.DEVELOPER] &&
            this.levels[EMPLOYEE_TYPE.MARKETING] >= this.goals[EMPLOYEE_TYPE.MARKETING] &&
            this.levels[EMPLOYEE_TYPE.SALE] >= this.goals[EMPLOYEE_TYPE.SALE]) {
            this.level += 1;
            this.levels[EMPLOYEE_TYPE.DEVELOPER] = 0;
            this.levels[EMPLOYEE_TYPE.MARKETING] = 0;
            this.levels[EMPLOYEE_TYPE.SALE] = 0;
            this.goals[EMPLOYEE_TYPE.DEVELOPER] = this.goals[EMPLOYEE_TYPE.DEVELOPER] * 2;
            this.goals[EMPLOYEE_TYPE.MARKETING] = this.goals[EMPLOYEE_TYPE.MARKETING] * 2;
            this.goals[EMPLOYEE_TYPE.SALE] = this.goals[EMPLOYEE_TYPE.SALE] * 2;
        }
    }
}