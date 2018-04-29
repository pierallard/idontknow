import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {AbstractState} from "./AbstractState";
import {Employee} from "../human_stuff/Employee";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {HumanState} from "./HumanState";

export class RageState extends AbstractState {
    private rageImage: RAGE_IMAGE;
    private isRaging: boolean;

    constructor(human: Employee, rageImage: RAGE_IMAGE) {
        super(human);
        this.rageImage = rageImage;
        this.isRaging = false;
    }

    getNextState(): HumanState {
        if (!this.isRaging && !this.human.isMoving()) {
            this.isRaging = true;
            this.human.loadAnimation(ANIMATION.RAGE);
            this.human.updateMoodFromState();
            this.human.showThoughtBubble(this.rageImage);
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.RAGE), () => {
                this.active = false;
                this.human.hideThoughtBubble();
            }, this));
        }
        return super.getNextState();
    }

    getState(): STATE {
        return STATE.RAGE;
    }

    getRageImage(): RAGE_IMAGE {
        return this.rageImage;
    }
}
