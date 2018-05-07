import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

const SECOND_MIN = 15 * Phaser.Timer.SECOND;
const SECOND_MAX = 45 * Phaser.Timer.SECOND;

export class TypeState extends MoveThenActAbstractState {
    private typeTime: number;

    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Desk'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        this.typeTime = Phaser.Math.random(SECOND_MIN, SECOND_MAX);

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
            this.worldKnowledge.addProgress(this.human.getType(), this.typeTime / SECOND_MAX, this.typeTime);
            this.events.push(this.game.time.events.add(this.typeTime, () => {
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

    protected getActTime(): number {
        return HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN) +
            this.typeTime +
            HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) +
            this.human.getWalkDuration();
    }

    getState(): STATE {
        return STATE.TYPE;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.LAPTOP;
    }
}
