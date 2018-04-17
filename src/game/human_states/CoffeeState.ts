import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {STATE} from "../human_stuff/HumanStateManager";
import {Dispenser} from "../objects/Dispenser";
import {PositionTransformer} from "../PositionTransformer";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {RageState} from "./RageState";

export class CoffeeState implements HumanState {
    private human: Employee;
    private active: boolean;
    private dispenser: Dispenser;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private worldKnowledge: WorldKnowledge;
    private events: Phaser.TimerEvent[];
    private tries: number;

    constructor(human: Employee, dispenser: Dispenser, worldKnowledge: WorldKnowledge, tries: number = 0) {
        this.human = human;
        this.dispenser = dispenser;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.events = [];
        this.tries = tries;
    }

    getNextState(): HumanState {
        if (!this.isHumanOnTheRightCell) {
            if (!this.worldKnowledge.hasObject(this.dispenser) || this.worldKnowledge.isObjectUsed(this.dispenser)) {
                const nextDispenser = this.worldKnowledge.getClosestFreeDispenser(this.human.getPosition());
                if (this.tries > this.human.getMaxRetries() || nextDispenser === null) {
                    this.active = false;
                    this.human.stopWalk();

                    return new RageState(this.human);
                }
                else {
                    return new CoffeeState(this.human, nextDispenser, this.worldKnowledge, this.tries + 1);
                }
            }
        }

        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.dispenser, this.dispenser.forceOrientation());
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.human.loadAnimation(ANIMATION.DRINK);
                this.human.updateMoodFromState();
                this.events.push(this.game.time.events.add(Math.floor(Phaser.Math.random(2, 4)) * HumanAnimationManager.getAnimationTime(ANIMATION.DRINK), () => {
                    this.human.goToFreeCell(this.dispenser.getEntries());
                    this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                        this.active = false;
                    }, this));
                }, this));
            }));
        }

        return this.active ? this : null;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.game = game;

        if (!this.human.moveToClosest(this.dispenser.getPositions()[0], this.dispenser.getEntries())) {
            this.active = false;
            this.stop(game);
            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.dispenser.getPositions()[0]);
    }

    stop(game: Phaser.Game): void {
        this.events.forEach((event) => {
            game.time.events.remove(event);
        });
        this.active = false;
    }

    getState(): STATE {
        return STATE.COFFEE;
    }
}
