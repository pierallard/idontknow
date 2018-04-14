import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {STATE} from "../human_stuff/HumanStateManager";
import {Dispenser} from "../objects/Dispenser";
import {PositionTransformer} from "../PositionTransformer";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";

export class CoffeeState implements HumanState {
    private human: Employee;
    private active: boolean;
    private dispenser: Dispenser;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private worldKnowledge: WorldKnowledge;
    private events: Phaser.TimerEvent[];

    constructor(human: Employee, dispenser: Dispenser, worldKnowledge: WorldKnowledge) {
        this.human = human;
        this.dispenser = dispenser;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.events = [];
    }

    isActive(): boolean {
        if (!this.isHumanOnTheRightCell) {
            if (this.worldKnowledge.isObjectUsed(this.dispenser)) {
                this.active = false;

                return false;
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

        return this.active;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.game = game;

        if (!this.human.moveToClosest(this.dispenser.getPosition(), this.dispenser.getEntries())) {
            this.active = false;
            this.stop(game);
            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.dispenser.getPosition());
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
