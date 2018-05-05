import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

const SECOND_MIN = 15 * Phaser.Timer.SECOND;
const SECOND_MAX = 45 * Phaser.Timer.SECOND;

export class TypeState extends MoveThenActAbstractState {
    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Desk'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        return super.start(game);
    }

    protected retry(): HumanState {
        if (this.tries > this.human.getMaxRetries()) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, this);
        } else {
            return new TypeState(this.human, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act(): void {
        this.human.loadAnimation(ANIMATION.SIT_DOWN, this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()));
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.TYPE, this.objectReferer.forceLeftOrientation(), this.objectReferer.forceTopOrientation());
            const time = Phaser.Math.random(SECOND_MIN, SECOND_MAX);
            this.worldKnowledge.addProgress(this.human.getType(), time / SECOND_MAX, time);
            this.events.push(this.game.time.events.add(time, () => {
                this.human.loadAnimation(ANIMATION.STAND_UP);
                this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                    this.human.goToFreeCell(this.objectReferer);
                    this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                        this.active = false;
                    }, this));
                }, this));
            }, this));
        }));
    }

    getState(): STATE {
        return STATE.TYPE;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.LAPTOP;
    }
}
