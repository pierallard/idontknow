import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {AbstractState} from "./AbstractState";
import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class RageState extends AbstractState {
    private sourceState: HumanState;
    private isRaging: boolean;

    constructor(human: Employee, sourceState: HumanState) {
        super(human);
        this.sourceState = sourceState;
        this.isRaging = false;
    }

    getNextState(): HumanState {
        if (!this.isRaging && !this.human.isMoving()) {
            this.isRaging = true;
            if (this.human.getMood() < 0.5) {
                this.human.loadAnimation(ANIMATION.RAGE);
            } else {
                this.human.loadAnimation(ANIMATION.FREEZE);
            }
            this.human.updateMoodFromState();
            this.human.showThoughtBubble(this.sourceState.getRageImage());
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.RAGE), () => {
                this.human.hideThoughtBubble();
                this.human.loadAnimation(ANIMATION.FREEZE);
                this.events.push(this.game.time.events.add(3 * Phaser.Timer.SECOND, () => {
                    this.active = false;
                }, this));
            }, this));
        }

        return super.getNextState();
    }

    getState(): STATE {
        return STATE.RAGE;
    }

    getRageImage(): RAGE_IMAGE {
        return this.sourceState.getRageImage();
    }

    getSourceState(): HumanState {
        return this.sourceState
    }
}
