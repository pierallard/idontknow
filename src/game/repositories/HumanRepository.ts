import {Human} from "../human_stuff/Human";
import {WorldKnowledge} from "../WorldKnowledge";

export class HumanRepository {
    humans: Human[];

    constructor(worldKnowledge: WorldKnowledge) {
        this.humans = [
            new Human(worldKnowledge.getRandomCell())
        ];
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }, worldKnowledge: WorldKnowledge) {
        this.humans.forEach((human) => {
            human.create(game, groups, worldKnowledge);
        })
    }

    update() {
        this.humans.forEach((human: Human) => {
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
