import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {AbstractState} from "./AbstractState";

export class RageState extends AbstractState {
    start(game: Phaser.Game): boolean {
        super.start(game);

        this.human.loadAnimation(ANIMATION.RAGE);
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.RAGE), () => {
            this.active = false;
        }, this));

        return true;
    }

    getState(): STATE {
        return STATE.RAGE;
    }
}