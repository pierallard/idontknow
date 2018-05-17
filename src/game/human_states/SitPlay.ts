import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {STATE} from "../human_stuff/HumanStateManager";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {HumanState} from "./HumanState";
import {Console} from "../objects/Console";

export class SitPlay extends MoveThenActAbstractState {
    private playTime: number;

    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Console'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        this.playTime = Phaser.Math.random(3, 10) * Phaser.Timer.SECOND;

        return super.start(game);
    }

    getState(): STATE {
        return STATE.SIT_PLAY;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.CONSOLE;
    }

    protected act(): void {
        this.human.loadAnimation(
            ANIMATION.SIT_DOWN,
            this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()),
            this.objectReferer.getObject().forceTopOrientation(this.objectReferer.getIdentifier())
        );
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.SIT_FREEZE);
            this.human.updateMoodFromState();
            const console = <Console> this.objectReferer.getObject();
            console.addPlayer();
            this.events.push(this.game.time.events.add(this.playTime, () => {
                console.removePlayer();
                this.human.loadAnimation(ANIMATION.STAND_UP);
                this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                    this.finish();
                }, this));
            }, this));
        }, this));
    }

    getDescription(): string {
        if (!this.isHumanOnTheRightCell) {
            return super.getDescription();
        } else {
            return 'is playing';
        }
    }

    protected getRetryState(): HumanState {
        return new SitPlay(this.human, this.worldKnowledge, this.tries + 1)
    }

    protected getActTime(): number {
        return HumanAnimationManager.getAnimationTime(ANIMATION.SIT_FREEZE) +
            this.playTime +
            HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) +
            this.human.getWalkDuration();
    }
}
