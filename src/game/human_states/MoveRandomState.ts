import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {World} from "../World";

export class MoveRandomState implements HumanState {
    private human: Human;
    private goal: PIXI.Point;

    constructor(human: Human, world: World) {
        this.human = human;
        this.goal = world.getGround().getRandomCell();
        while (this.human.getPosition().x === this.goal.x && this.human.getPosition().y === this.goal.y) {
            this.goal = world.getGround().getRandomCell();
        }
    }

    isActive(): boolean {
        return this.human.getPosition().x !== this.goal.x ||
            this.human.getPosition().y !== this.goal.y ||
            this.human.isMoving();
    }

    start(game: Phaser.Game): void {
        this.human.moveTo(this.goal);
    }
}