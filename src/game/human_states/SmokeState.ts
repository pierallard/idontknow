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

        game.time.events.add(Phaser.Math.random(1, 3) * HumanAnimationManager.getAnimationTime(ANIMATION.SMOKE), () => {
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
