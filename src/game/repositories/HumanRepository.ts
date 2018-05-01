import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {EMPLOYEE_TYPE, HumanPropertiesFactory} from "../human_stuff/HumanPropertiesFactory";

export class HumanRepository {
    humans: Employee[];

    constructor(worldKnowledge: WorldKnowledge) {
        this.humans = [
            new Employee(worldKnowledge.getRandomCell(), HumanPropertiesFactory.create([EMPLOYEE_TYPE.DEVELOPER]))
        ];
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }, worldKnowledge: WorldKnowledge) {
        this.humans.forEach((human) => {
            human.create(game, groups, worldKnowledge);
        })
    }

    update() {
        this.humans.forEach((human: Employee) => {
            human.update();
        })
    }

    getCount(type: EMPLOYEE_TYPE): number {
        return this.humans.filter((human) => {
            return human.getType() === type;
        }).length;
    }
}
