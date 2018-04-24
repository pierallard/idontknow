import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {AbstractState} from "./AbstractState";
import {Employee} from "../human_stuff/Employee";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class RageState extends AbstractState {
    private rageImage: RAGE_IMAGE;

    constructor(human: Employee, rageImage: RAGE_IMAGE) {
        super(human);
        this.rageImage = rageImage;
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        this.human.loadAnimation(ANIMATION.RAGE);
        this.human.showThoughtBubble(this.rageImage);
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.RAGE), () => {
            this.active = false;
            this.human.hideThoughtBubble();
        }, this));

        return true;
    }

    getState(): STATE {
        return STATE.RAGE;
    }
}
