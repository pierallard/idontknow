import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";

export class TypeState extends MoveThenActAbstractState {
    protected retry(): HumanState {
        const nextDeskReferer = this.worldKnowledge.getClosestReferer(['Desk'], 1, this.human.getPosition());
        if (this.tries > this.human.getMaxRetries() || nextDeskReferer === null) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human);
        } else {
            return new TypeState(this.human, nextDeskReferer, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act(): void {
        this.human.loadAnimation(ANIMATION.SIT_DOWN, this.objectReferer.getObject().forceOrientation());
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.TYPE);
            this.worldKnowledge.addProgress(this.human.getType(), 1);
            this.events.push(this.game.time.events.add(Phaser.Math.random(15, 60) * Phaser.Timer.SECOND, () => {
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
}
