import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class SitState extends MoveThenActAbstractState {
    protected retry(): HumanState {
        const nextSofaReferer = this.worldKnowledge.getClosestReferer(['Sofa'], 1, this.human.getPosition());
        if (this.tries > this.human.getMaxRetries() || nextSofaReferer === null) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, RAGE_IMAGE.SLEEP);
        } else {
            return new SitState(this.human, nextSofaReferer, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act() {
        this.human.loadAnimation(ANIMATION.SIT_DOWN, this.objectReferer.getObject().forceOrientation(this.objectReferer.getIdentifier()));
        this.human.updateMoodFromState();
        this.events.push(this.game.time.events.add(Phaser.Math.random(3, 10) * Phaser.Timer.SECOND + HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.STAND_UP);
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                this.human.goToFreeCell(this.objectReferer);
                this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                    this.active = false;
                }, this));
            }, this));
        }, this));
    }

    getState(): STATE {
        return STATE.SIT;
    }
}
