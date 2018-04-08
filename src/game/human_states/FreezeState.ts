import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {ANIMATION} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";

export class FreezeState implements HumanState {
    private human: Human;
    private active: boolean;
    private event: Phaser.TimerEvent;

    constructor(human: Human) {
        this.human = human;
    }

    isActive(): boolean {
        return this.active;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.human.loadAnimation(ANIMATION.FREEZE);
        this.event = game.time.events.add(Phaser.Math.random(1, 2) * Phaser.Timer.SECOND, this.end, this);
        return true;
    }

    end(): void {
        this.active = false;
    }

    stop(game: Phaser.Game): void {
        if (this.event) {
            game.time.events.remove(this.event);
        }
        this.end();
    }

    getState(): STATE {
        return STATE.FREEZE;
    }
}