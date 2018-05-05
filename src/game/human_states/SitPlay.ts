import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {HumanState} from "./HumanState";
import {Console} from "../objects/Console";

export class SitPlay extends MoveThenActAbstractState {
    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Console'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        return super.start(game);
    }

    getState(): STATE {
        return STATE.SIT_PLAY;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        // TODO Set another image!
        return RAGE_IMAGE.SLEEP
    }

    protected act(): void {
        this.human.loadAnimation(
            ANIMATION.SIT_DOWN,
            this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()),
            this.objectReferer.getObject().forceTopOrientation(this.objectReferer.getIdentifier())
        );
        this.human.updateMoodFromState();
        const console = <Console> this.objectReferer.getObject();
        console.addPlayer();
        this.events.push(this.game.time.events.add(Phaser.Math.random(3, 10) * Phaser.Timer.SECOND + HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            console.removePlayer();
            this.human.loadAnimation(ANIMATION.STAND_UP);
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                this.finish();
            }, this));
        }, this));
    }

    protected getRetryState(): HumanState {
        return new SitPlay(this.human, this.worldKnowledge, this.tries + 1)
    }
}