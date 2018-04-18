import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {PositionTransformer} from "../PositionTransformer";
import {RageState} from "./RageState";
import {ObjectReferer} from "../objects/ObjectReferer";
import {AbstractState} from "./AbstractState";

export class TypeState extends AbstractState {
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
                const nextDeskReferer = this.worldKnowledge.getClosestReferer(['Desk'], this.human.getPosition());
                if (this.tries > this.human.getMaxRetries() || nextDeskReferer === null) {
                    this.active = false;
                    this.human.stopWalk();

                    return new RageState(this.human);
                } else {
                    return new TypeState(this.human, nextDeskReferer, this.worldKnowledge, this.tries + 1);
                }
            }
        }
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.objectReferer, this.objectReferer.getObject().forceOrientation());
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
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
            }, this));
        }

        return super.getNextState();
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        if (!this.human.moveToClosest(this.objectReferer.getPosition(), this.objectReferer.getEntries())) {
            this.active = false;

            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.objectReferer.getPosition());
    }

    getState(): STATE {
        return STATE.TYPE;
    }
}
