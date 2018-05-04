import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class SitState extends MoveThenActAbstractState {
    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Sofa', 'Couch'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        return super.start(game);
    }

    protected retry(): HumanState {
        if (this.tries > this.human.getMaxRetries()) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, RAGE_IMAGE.SLEEP);
        } else {
            return new SitState(this.human, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act() {
        this.human.loadAnimation(
            ANIMATION.SIT_DOWN,
            this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()),
            this.objectReferer.getObject().forceTopOrientation(this.objectReferer.getIdentifier())
        );
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

    getRageState(): HumanState {
        return new RageState(this.human, RAGE_IMAGE.SLEEP);
    }
}
