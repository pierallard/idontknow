import {Cell} from "../Cell";
import {Human} from "../Human";

export default class Play extends Phaser.State {
    public create() {
        this.game.stage.backgroundColor = "#4488AA";

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 6; y++) {
                new Cell(this.game, new PIXI.Point(x, y));
            }
        }

        new Human(this.game, new PIXI.Point(0, 0));
    }

    update() {

    }
}
