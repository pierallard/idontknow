import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {ANIMATION} from "../human_stuff/HumanAnimationManager";

export class SmokeState implements HumanState {
    private human: Human;
    private active: boolean;
    private timeLoop: number;

    constructor(human: Human, timeLoop: number) {
        this.human = human;
        this.timeLoop = timeLoop;
    }

    isActive(): boolean {
        return this.active;
    }

    start(game: Phaser.Game): void {
        game.time.events.add(Phaser.Math.random(1, 3) * this.timeLoop, this.end, this);
        this.active = true;
        this.human.loadAnimation(ANIMATION.SMOKE);
    }

    end(): void {
        this.active = false;
    }
}