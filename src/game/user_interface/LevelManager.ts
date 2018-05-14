import {EMPLOYEE_TYPE} from "../human_stuff/HumanPropertiesFactory";
import {SmoothValue} from "../SmoothValue";
import {Price} from "../objects/Price";

const DEVELOPER_RATIO = 500;
const MARKETING_RATIO = 5;
const SALE_RATIO = 10;
const STARTING_LEVEL = 1;
const GLOBAL_PROGRESS_EARN = 7;

export class LevelManager {
    private level: number;
    private starts: {[index: number] : number};
    private levels: {[index: number] : SmoothValue};

    constructor() {
        this.level = STARTING_LEVEL;
        this.starts = {};

        this.starts[EMPLOYEE_TYPE.DEVELOPER] = 0;
        this.starts[EMPLOYEE_TYPE.MARKETING] = 0;
        this.starts[EMPLOYEE_TYPE.SALE] = 0;

        this.levels = {};
        this.levels[EMPLOYEE_TYPE.DEVELOPER] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.MARKETING] = new SmoothValue(0);
        this.levels[EMPLOYEE_TYPE.SALE] = new SmoothValue(0);
    }

    getLevelProgress(type: EMPLOYEE_TYPE): number {
        return Math.min((this.levels[type].getValue() - this.starts[type]) / (this.getGoal(type) - this.starts[type]), 1);
    }

    getLevelValue(type: EMPLOYEE_TYPE): number {
        return this.levels[type].getValue();
    }

    addLevelProgress(type: EMPLOYEE_TYPE, value: number, time: number) {
        let realValue = 0;
        switch (type) {
            case EMPLOYEE_TYPE.DEVELOPER: realValue = value * DEVELOPER_RATIO / GLOBAL_PROGRESS_EARN; break;
            case EMPLOYEE_TYPE.MARKETING: realValue = value * MARKETING_RATIO / GLOBAL_PROGRESS_EARN; break;
            case EMPLOYEE_TYPE.SALE: realValue = value * SALE_RATIO / GLOBAL_PROGRESS_EARN; break;
        }
        this.levels[type].add(realValue, time);
    }

    update() {
        this.levels[EMPLOYEE_TYPE.DEVELOPER].update();
        this.levels[EMPLOYEE_TYPE.MARKETING].update();
        this.levels[EMPLOYEE_TYPE.SALE].update();

        if (this.levels[EMPLOYEE_TYPE.DEVELOPER].getValue() >= this.getGoal(EMPLOYEE_TYPE.DEVELOPER) &&
            this.levels[EMPLOYEE_TYPE.MARKETING].getValue() >= this.getGoal(EMPLOYEE_TYPE.MARKETING) &&
            this.levels[EMPLOYEE_TYPE.SALE].getValue() >= this.getGoal(EMPLOYEE_TYPE.SALE)) {
            this.starts[EMPLOYEE_TYPE.DEVELOPER] = this.getGoal(EMPLOYEE_TYPE.DEVELOPER);
            this.starts[EMPLOYEE_TYPE.MARKETING] = this.getGoal(EMPLOYEE_TYPE.MARKETING);
            this.starts[EMPLOYEE_TYPE.SALE] = this.getGoal(EMPLOYEE_TYPE.SALE);
            this.level += 1;

            return true;
        }

        return false;
    }

    getLevel(): number {
        return this.level;
    }

    getGoal(type: EMPLOYEE_TYPE) {
        if (this.level <= 1 && type === EMPLOYEE_TYPE.SALE) {
            return 0;
        }
        if (this.level <= 2 && type === EMPLOYEE_TYPE.MARKETING) {
            return 0;
        }
        switch (type) {
            case EMPLOYEE_TYPE.DEVELOPER: return DEVELOPER_RATIO * Math.pow(2, this.level - 1);
            case EMPLOYEE_TYPE.SALE: return SALE_RATIO * Math.pow(2, this.level - 2);
            case EMPLOYEE_TYPE.MARKETING: return MARKETING_RATIO * Math.pow(2, this.level - 3);
        }
    }

    getEarnedMoney(): Price {
        return new Price(1000 * Math.pow(2, this.level - 1));
    }

    getSoftwarePrice(): Price {
        return new Price(this.levels[EMPLOYEE_TYPE.DEVELOPER].getValue() / 2);
    }
}
