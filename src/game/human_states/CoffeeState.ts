import {STATE} from "../human_stuff/HumanStateManager";
import {Dispenser} from "../objects/Dispenser";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {RageState} from "./RageState";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {HumanState} from "./HumanState";

export class CoffeeState extends MoveThenActAbstractState {
    protected retry(): HumanState {
        const nextDispenserReferer = this.worldKnowledge.getClosestReferer(['Dispenser'], this.human.getPosition());
        if (this.tries > this.human.getMaxRetries() || nextDispenserReferer === null) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human);
        }
        else {
            return new CoffeeState(this.human, nextDispenserReferer, this.worldKnowledge, this.tries + 1);
        }
    }

    protected act() {
        this.human.loadAnimation(ANIMATION.DRINK);
        this.human.updateMoodFromState();
        this.events.push(this.game.time.events.add(Math.floor(Phaser.Math.random(2, 4)) * HumanAnimationManager.getAnimationTime(ANIMATION.DRINK), () => {
            this.human.goToFreeCell(this.objectReferer);
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.active = false;
            }, this));
        }, this));
    }

    getState(): STATE {
        return STATE.COFFEE;
    }
}
