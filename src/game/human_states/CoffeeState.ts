import {STATE} from "../human_stuff/HumanStateManager";
import {Dispenser} from "../objects/Dispenser";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class CoffeeState extends MoveThenActAbstractState {
    private drinkTime: number;

    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Dispenser'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        this.drinkTime = Math.floor(Phaser.Math.random(2, 4)) * HumanAnimationManager.getAnimationTime(ANIMATION.DRINK);

        return super.start(game);
    }

    protected retry(): HumanState {
        if (this.tries > this.human.getMaxRetries()) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, this);
        }
        else {
            return new CoffeeState(this.human, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act() {
        this.human.loadAnimation(ANIMATION.DRINK);
        this.human.updateMoodFromState();
        this.events.push(this.game.time.events.add(this.drinkTime, () => {
            this.human.goToFreeCell(this.objectReferer);
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.active = false;
            }, this));
        }, this));
    }

    protected getActTime(): number {
        return this.drinkTime + this.human.getWalkDuration();
    }

    getState(): STATE {
        return STATE.COFFEE;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.COFFEE;
    }
}
