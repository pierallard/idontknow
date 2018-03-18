import {Human} from "../Human";
import {PositionTransformer} from "../PositionTransformer";
import {Ground} from "../Ground";

export default class Play extends Phaser.State {

    private human: Human;
    private ground: Ground;

    private group: Phaser.Group;

    constructor() {
        super();
    }

    public create() {
        this.game.stage.backgroundColor = "#4488AA";
        const floor = this.game.add.group();
        this.group = this.game.add.group();
        this.ground = new Ground(this.game, floor, this.group);

        this.human = new Human(this, this.game, this.group, new PIXI.Point(0, 0), this.ground);
    }

    update() {
        this.group.sort('y', Phaser.Group.SORT_ASCENDING);

        if (this.game.input.activePointer.isDown) {
            const position = PositionTransformer.getCellPosition(this.game.input.activePointer.position);
            this.human.moveTo(position);
        }
    }
}
