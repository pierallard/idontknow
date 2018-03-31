import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";

export class TalkState implements HumanState {
    private human: Human;
    private active: boolean;

    constructor(human: Human) {
        this.human = human;
    }

    isActive(): boolean {
        return this.active;
    }

    start(game: Phaser.Game): void {
        game.time.events.add(Phaser.Math.random(10, 30) * HumanAnimationManager.getAnimationTime(ANIMATION.TALK), this.end, this);
        this.active = true;
        this.human.loadAnimation(ANIMATION.TALK);
    }

    end(): void {
        this.active = false;
    }

    stop(game: Phaser.Game): void {
    }
}