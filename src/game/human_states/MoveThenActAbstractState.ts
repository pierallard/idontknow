import {AbstractState} from "./AbstractState";
import {ObjectReferer} from "../objects/ObjectReferer";
import {WorldKnowledge} from "../WorldKnowledge";
import {Employee} from "../human_stuff/Employee";
import {STATE} from "../human_stuff/HumanStateManager";
import {PositionTransformer} from "../PositionTransformer";
import {HumanState} from "./HumanState";

export abstract class MoveThenActAbstractState extends AbstractState {
    protected objectReferer: ObjectReferer;
    protected isHumanOnTheRightCell: boolean;
    protected worldKnowledge: WorldKnowledge;
    protected tries: number;

    constructor(human: Employee, objectReferer: ObjectReferer, worldKnowledge: WorldKnowledge, tries: number = 0) {
        super(human);
        this.objectReferer = objectReferer;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.tries = tries;
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        if (!this.human.moveToClosest(this.objectReferer.getPosition(), this.objectReferer.getEntries())) {
            this.active = false;
            this.stop();
            return false;
        }

        return true;
    }

    getNextState(): HumanState {
        if (!this.isHumanOnTheRightCell) {
            if (!this.worldKnowledge.hasObject(this.objectReferer.getObject()) || this.objectReferer.isUsed()) {
                return this.retry();
            }
        }

        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.objectReferer, this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()));
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.act();
            }));
        }

        return super.getNextState();
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.objectReferer.getPosition());
    }

    abstract getState(): STATE;

    protected abstract retry(): HumanState;

    protected abstract act(): void;
}
