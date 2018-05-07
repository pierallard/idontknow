import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class SmokeState extends AbstractState {
    getRageImage(): RAGE_IMAGE {
        debugger;
        return null;
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        const time = Phaser.Math.random(1, 3) * HumanAnimationManager.getAnimationTime(ANIMATION.SMOKE);
        this.startTimer(time);

        game.time.events.add(time, () => {
            this.active = false;
        }, this);
        this.human.loadAnimation(ANIMATION.SMOKE);
        this.human.updateMoodFromState();
        return true;
    }

    getState(): STATE {
        return STATE.SMOKE;
    }
}
