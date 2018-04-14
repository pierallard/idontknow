import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";

export class HumanRepository {
    humans: Employee[];

    constructor(worldKnowledge: WorldKnowledge) {
        this.humans = [
            new Employee(worldKnowledge.getRandomCell())
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

    getSelectedHumanSprite() {
        for (let i = 0; i < this.humans.length; i++) {
            if (this.humans[i].isSelected()) {
                return this.humans[i].getSprite();
            }
        }

        return null;
    }
}
