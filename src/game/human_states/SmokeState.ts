import {ANIMATION, Human} from "../Human";
import {HumanState} from "./HumanState";

export class SmokeState implements HumanState {
    private human: Human;
    private active: boolean;

    constructor(human: Human) {
        this.human = human;
    }

    isActive(): boolean {
        return this.active;
    }

    start(game: Phaser.Game): void {
        game.time.events.add(Phaser.Math.random(1, 3) * Phaser.Timer.SECOND, this.end, this);
        this.active = true;
        this.human.loadAnimation(ANIMATION.SMOKE);
    }

    end(): void {
        this.active = false;
    }
}