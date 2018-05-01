import {HumanRepository} from "../repositories/HumanRepository";
import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";
import {INTERFACE_WIDTH} from "../user_interface/UserInterface";

export class EmployeeCountRegister {
    private humanRepository: HumanRepository;
    private counts: {[index: number]: number[]};

    constructor(humanRepository: HumanRepository) {
        this.humanRepository = humanRepository;
        this.counts = {};
        this.counts[EMPLOYEE_TYPE.DEVELOPER] = [];
        this.counts[EMPLOYEE_TYPE.SALE] = [];
        this.counts[EMPLOYEE_TYPE.MARKETING] = [];
    }

    create(game: Phaser.Game) {
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.updateCounts, this);
    }

    updateCounts() {
        this.counts[EMPLOYEE_TYPE.DEVELOPER].push(this.humanRepository.getCount(EMPLOYEE_TYPE.DEVELOPER));
        this.counts[EMPLOYEE_TYPE.SALE].push(this.humanRepository.getCount(EMPLOYEE_TYPE.SALE));
        this.counts[EMPLOYEE_TYPE.MARKETING].push(this.humanRepository.getCount(EMPLOYEE_TYPE.MARKETING));
    }

    getLastCounts(): number[][] {
        let result = [[], [], []];
        for (let i = 0; i < INTERFACE_WIDTH; i++) {
            result[0].push(this.counts[EMPLOYEE_TYPE.DEVELOPER][this.counts[EMPLOYEE_TYPE.DEVELOPER].length - 1 - i]);
            result[1].push(this.counts[EMPLOYEE_TYPE.SALE][this.counts[EMPLOYEE_TYPE.SALE].length - 1 - i]);
            result[2].push(this.counts[EMPLOYEE_TYPE.MARKETING][this.counts[EMPLOYEE_TYPE.MARKETING].length - 1 - i]);
        }
        return result;
    }
}