import {HumanState} from "./HumanState";
import {STATE} from "../human_stuff/HumanStateManager";
import {Employee} from "../human_stuff/Employee";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export abstract class AbstractState implements HumanState {
    protected events: Phaser.TimerEvent[];
    protected active: boolean;
    protected game: Phaser.Game;
    protected human: Employee;
    protected remainingTime: number;

    constructor(human: Employee) {
        this.events = [];
        this.active = false;
        this.human = human;
        this.remainingTime = null;
    }

    getNextState(): HumanState {
        return this.active ? this : null;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.game = game;

        return true;
    }

    stop(): void {
        this.events.forEach((event) => {
            this.game.time.events.remove(event);
        });
        this.active = false;
    }

    protected startTimer(value: number) {
        this.remainingTime = value;
        this.game.time.events.loop(Phaser.Timer.SECOND, () => {
            this.remainingTime = Math.max(this.remainingTime - Phaser.Timer.SECOND, 0);
        }, this);
    }

    getRemainingSeconds(): number {
        return Math.round(this.remainingTime / Phaser.Timer.SECOND);
    }

    abstract getState(): STATE;

    abstract getRageImage(): RAGE_IMAGE;
}
