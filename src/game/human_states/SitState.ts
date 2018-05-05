import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {HumanState} from "./HumanState";

export class SitState extends MoveThenActAbstractState {
    private sitTime: number;

    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Sofa', 'Couch'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        this.sitTime = Phaser.Math.random(3, 10) * Phaser.Timer.SECOND;

        return super.start(game);
    }

    protected act() {
        this.human.loadAnimation(
            ANIMATION.SIT_DOWN,
            this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()),
            this.objectReferer.getObject().forceTopOrientation(this.objectReferer.getIdentifier())
        );
        this.human.updateMoodFromState();
        this.events.push(this.game.time.events.add(this.sitTime + HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.STAND_UP);
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                this.finish();
            }, this));
        }, this));
    }

    protected getActTime(): number {
        return HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN) +
            this.sitTime +
            HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) +
            this.human.getWalkDuration();
    }

    getState(): STATE {
        return STATE.SIT;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.SLEEP;
    }

    protected getRetryState(): HumanState {
        return new SitState(this.human, this.worldKnowledge, this.tries + 1)
    }
}
