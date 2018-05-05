import {ANIMATION} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class FreezeState extends AbstractState {
    private event: Phaser.TimerEvent;

    start(game: Phaser.Game): boolean {
        super.start(game);
        this.human.loadAnimation(ANIMATION.FREEZE);
        this.event = game.time.events.add(Phaser.Math.random(1, 2) * Phaser.Timer.SECOND, () => {
            this.active = false;
        }, this);

        return true;
    }

    getState(): STATE {
        return STATE.FREEZE;
    }

    getRageImage(): RAGE_IMAGE {
        debugger;
        return null;
    }
}
