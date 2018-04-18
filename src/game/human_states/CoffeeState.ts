import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {STATE} from "../human_stuff/HumanStateManager";
import {Dispenser} from "../objects/Dispenser";
import {PositionTransformer} from "../PositionTransformer";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {RageState} from "./RageState";
import {ObjectReferer} from "../objects/ObjectReferer";
import {AbstractState} from "./AbstractState";

export class CoffeeState extends AbstractState {
    private objectReferer: ObjectReferer;
    private isHumanOnTheRightCell: boolean;
    private worldKnowledge: WorldKnowledge;
    private tries: number;

    constructor(human: Employee, objectReferer: ObjectReferer, worldKnowledge: WorldKnowledge, tries: number = 0) {
        super(human);

        this.objectReferer = objectReferer;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.tries = tries;
    }

    getNextState(): HumanState {
        if (!this.isHumanOnTheRightCell) {
            if (!this.worldKnowledge.hasObject(this.objectReferer.getObject()) || this.objectReferer.isUsed()) {
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
        }

        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.objectReferer, this.objectReferer.getObject().forceOrientation());
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.human.loadAnimation(ANIMATION.DRINK);
                this.human.updateMoodFromState();
                this.events.push(this.game.time.events.add(Math.floor(Phaser.Math.random(2, 4)) * HumanAnimationManager.getAnimationTime(ANIMATION.DRINK), () => {
                    this.human.goToFreeCell(this.objectReferer);
                    this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                        this.active = false;
                    }, this));
                }, this));
            }));
        }

        return super.getNextState();
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        if (!this.human.moveToClosest(this.objectReferer.getPosition(), this.objectReferer.getEntries())) {
            this.active = false;
            this.stop(game);
            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.objectReferer.getPosition());
    }

    getState(): STATE {
        return STATE.COFFEE;
    }
}
