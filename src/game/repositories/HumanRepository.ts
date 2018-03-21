import {Human} from "../Human";
import {World} from "../World";

export class HumanRepository {
    humans: Human[];

    constructor() {
        this.humans = [
            new Human(new PIXI.Point(0, 0))
        ];
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }, world: World) {
        this.humans.forEach((human) => {
            human.create(game, groups['noname'], world);
        })
    }

    getFirstHuman(): Human {
        return this.humans[0];
    }

    getHumans(): Human[] {
        return this.humans;
    }
}