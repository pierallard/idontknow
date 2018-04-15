import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";

export class RageState implements HumanState {
    private human: Employee;
    private events: Phaser.TimerEvent[];
    private game: Phaser.Game;
    private active: boolean;

    constructor(human: Employee) {
        this.human = human;
        this.events = [];
    }

    getNextState(): HumanState {
        return this.active ? this : null;
    }

    start(game: Phaser.Game): boolean {
        this.game = game;
        this.active = true;

        this.human.loadAnimation(ANIMATION.RAGE);
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.RAGE), () => {
            this.active = false;
        }, this));

        return true;
    }

    stop(game: Phaser.Game): void {
        this.events.forEach((event) => {
            game.time.events.remove(event);
        });
        this.active = false;
    }

    getState(): STATE {
        return STATE.RAGE;
    }
}