import {HumanState} from "./HumanState";
import {ANIMATION, Human} from "../Human";

export class SitState implements HumanState {
    private human: Human;
    private loopTime: number;
    private active: boolean;

    constructor(human: Human, loopTime: number) {
        this.human = human;
        this.loopTime = loopTime;
    }

    isActive(): boolean {
        return this.active;
    }

    start(game: Phaser.Game): void {
        this.active = true;
        this.human.loadAnimation(ANIMATION.SIT_DOWN);
        game.time.events.add(Phaser.Math.random(1, 3) * Phaser.Timer.SECOND + this.loopTime, this.standup, this, game);
    }

    private standup(game: Phaser.Game) {
        this.human.loadAnimation(ANIMATION.STAND_UP);
        game.time.events.add(this.loopTime, this.end, this);
    }

    private end() {
        this.active = false;
    }

}