import {Human} from "../Human";
import {HumanState} from "./HumanState";

export class MoveRandomState implements HumanState {
    private human: Human;
    private goal: PIXI.Point;

    constructor(human: Human) {
        this.human = human;
        this.goal = new PIXI.Point(Math.floor(Phaser.Math.random(0, 6)), Math.floor(Phaser.Math.random(0, 6)))
    }

    isActive(): boolean {
        return this.human.getPosition().x === this.goal.x && this.human.getPosition().y === this.goal.y;
    }

    start(game: Phaser.Game): void {
        this.human.moveTo(this.goal);
    }
}