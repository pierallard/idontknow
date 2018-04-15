import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";

export class SmokeState implements HumanState {
    private human: Employee;
    private active: boolean;

    constructor(human: Employee) {
        this.human = human;
    }

    getNextState(): HumanState {
        return this.active ? this : null;
    }

    start(game: Phaser.Game): boolean {
        game.time.events.add(Phaser.Math.random(1, 3) * HumanAnimationManager.getAnimationTime(ANIMATION.SMOKE), this.end, this);
        this.active = true;
        this.human.loadAnimation(ANIMATION.SMOKE);
        this.human.updateMoodFromState();

        return true;
    }

    end(): void {
        this.active = false;
    }

    stop(game: Phaser.Game): void {
        this.active = false;
    }

    getState(): STATE {
        return STATE.SMOKE;
    }
}