import {AbstractState} from "./AbstractState";
import {ObjectReferer} from "../objects/ObjectReferer";
import {WorldKnowledge} from "../WorldKnowledge";
import {Employee} from "../human_stuff/Employee";
import {STATE} from "../human_stuff/HumanStateManager";
import {PositionTransformer} from "../PositionTransformer";
import {HumanState} from "./HumanState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {RageState} from "./RageState";

export abstract class MoveThenActAbstractState extends AbstractState {
    protected objectReferer: ObjectReferer;
    protected isHumanOnTheRightCell: boolean;
    protected worldKnowledge: WorldKnowledge;
    protected tries: number;
    private noPathFound: boolean;

    constructor(human: Employee, worldKnowledge: WorldKnowledge, tries: number = 0) {
        super(human);
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.tries = tries;
        this.noPathFound = false;
    }

    start(game: Phaser.Game): boolean {
        if (!super.start(game)) {
            return false;
        }

        if (!this.human.moveToClosest(this.objectReferer.getPosition(), this.objectReferer.getEntries())) {
            this.noPathFound = true;
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
            this.events.push(this.game.time.events.add(this.human.getWalkDuration(), () => {
                this.act();
            }));
        }

        return super.getNextState();
    }

    getDescription(): string {
        return 'Looking for ' + this.objectReferer.getObject().getDescription().getName();
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.objectReferer.getPosition());
    }

    getRageImage(): RAGE_IMAGE {
        if (this.noPathFound) {
            return RAGE_IMAGE.PATH;
        } else {
            return this.subGetRageImage();
        }
    }

    abstract getState(): STATE;

    protected retry(): HumanState {
        if (this.tries > this.human.getMaxRetries()) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, this);
        }
        else {
            return this.getRetryState();
        }
    }

    protected abstract getRetryState(): HumanState;

    protected abstract subGetRageImage(): RAGE_IMAGE;

    protected abstract act(): void;

    protected abstract getActTime(): number;

    protected finish() {
        this.human.goToFreeCell(this.objectReferer);
        this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
            this.active = false;
        }, this));
    }
}
