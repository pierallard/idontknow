import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {World} from "../World";
import {STATE} from "../human_stuff/HumanStateManager";

export class MoveRandomState implements HumanState {
    private human: Human;
    private goal: PIXI.Point;
    private active: boolean;

    constructor(human: Human, world: World) {
        this.active = false;
        this.human = human;
        this.goal = world.getGround().getRandomCell();
        while (this.human.getPosition().x === this.goal.x && this.human.getPosition().y === this.goal.y) {
            this.goal = world.getGround().getRandomCell();
        }
    }

    isActive(): boolean {
        return this.active && this.human.getPosition().x !== this.goal.x ||
            this.human.getPosition().y !== this.goal.y ||
            this.human.isMoving();
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        if (!this.human.moveTo(this.goal)) {
            this.stop(game);
            return false;
        }

        return true;
    }

    stop(game: Phaser.Game): void {
        this.active = false;
    }

    getState(): STATE {
        return STATE.MOVE_RANDOM;
    }
}