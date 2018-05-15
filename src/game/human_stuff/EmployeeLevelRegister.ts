import {HumanRepository} from "../repositories/HumanRepository";
import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";
import {INTERFACE_WIDTH} from "../user_interface/UserInterface";
import {DEVELOPER_RATIO, LevelManager, MARKETING_RATIO, SALE_RATIO} from "../user_interface/LevelManager";

export class EmployeeLevelRegister {
    private levelManager: LevelManager;
    private levels: {[index: number]: number[]};
    private lastLevels: {[index: number]: number};

    constructor(levelManager: LevelManager) {
        this.levelManager = levelManager;
        this.levels = {};
        this.lastLevels = {};
        this.levels[EMPLOYEE_TYPE.DEVELOPER] = [];
        this.levels[EMPLOYEE_TYPE.SALE] = [];
        this.levels[EMPLOYEE_TYPE.MARKETING] = [];
        this.lastLevels[EMPLOYEE_TYPE.DEVELOPER] = 0;
        this.lastLevels[EMPLOYEE_TYPE.SALE] = 0;
        this.lastLevels[EMPLOYEE_TYPE.MARKETING] = 0;
    }

    create(game: Phaser.Game) {
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.updateCounts, this);
    }

    updateCounts() {
        const dev = this.levelManager.getLevelValue(EMPLOYEE_TYPE.DEVELOPER) / DEVELOPER_RATIO;
        const sal = this.levelManager.getLevelValue(EMPLOYEE_TYPE.SALE) / SALE_RATIO;
        const mar = this.levelManager.getLevelValue(EMPLOYEE_TYPE.MARKETING) / MARKETING_RATIO;
        this.levels[EMPLOYEE_TYPE.DEVELOPER].push(dev - this.lastLevels[EMPLOYEE_TYPE.DEVELOPER]);
        this.levels[EMPLOYEE_TYPE.SALE].push(sal - this.lastLevels[EMPLOYEE_TYPE.SALE]);
        this.levels[EMPLOYEE_TYPE.MARKETING].push(mar - this.lastLevels[EMPLOYEE_TYPE.MARKETING]);
        this.lastLevels[EMPLOYEE_TYPE.DEVELOPER] = dev;
        this.lastLevels[EMPLOYEE_TYPE.SALE] = sal;
        this.lastLevels[EMPLOYEE_TYPE.MARKETING] = mar;
    }

    getLastCounts(): number[][] {
        let result = [[], [], []];
        for (let i = 0; i < INTERFACE_WIDTH; i++) {
            result[0].push(this.levels[EMPLOYEE_TYPE.DEVELOPER][this.levels[EMPLOYEE_TYPE.DEVELOPER].length - 1 - i]);
            result[1].push(this.levels[EMPLOYEE_TYPE.SALE][this.levels[EMPLOYEE_TYPE.SALE].length - 1 - i]);
            result[2].push(this.levels[EMPLOYEE_TYPE.MARKETING][this.levels[EMPLOYEE_TYPE.MARKETING].length - 1 - i]);
        }
        return result;
    }
}
