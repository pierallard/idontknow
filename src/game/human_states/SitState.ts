import {HumanState} from "./HumanState";
import {Human, WALK_CELL_DURATION} from "../human_stuff/Human";
import {WorldKnowledge} from "../WorldKnowledge";
import {InteractiveObjectInterface} from "../objects/InteractiveObjectInterface";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {PositionTransformer} from "../PositionTransformer";
import {HUMOR} from "../human_stuff/HumanHumorManager";

export class SitState implements HumanState {
    private human: Human;
    private active: boolean;
    private interactiveObject: InteractiveObjectInterface;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private worldKnowledge: WorldKnowledge;
    private events: Phaser.TimerEvent[];

    constructor(human: Human, interactiveObject: InteractiveObjectInterface, worldKnowledge: WorldKnowledge) {
        this.human = human;
        this.interactiveObject = interactiveObject;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.events = [];
    }

    isActive(): boolean {
        if (!this.isHumanOnTheRightCell) {
            if (this.worldKnowledge.isObjectUsed(this.interactiveObject)) {
                this.active = false;

                return false;
            }
        }
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.interactiveObject);
            this.events.push(this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                this.human.loadAnimation(ANIMATION.SIT_DOWN);
                this.human.updateHumorFromState();
                this.events.push(this.game.time.events.add(Phaser.Math.random(3, 10) * Phaser.Timer.SECOND + HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
                    this.human.loadAnimation(ANIMATION.STAND_UP);
                    this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                        this.human.goToFreeCell(this.interactiveObject.getEntries());
                        this.events.push(this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                            this.active = false;
                        }, this));
                    }, this));
                }, this));
            }, this));
        }

        return this.active;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.game = game;

        if (!this.human.moveToClosest(this.interactiveObject.getPosition(), this.interactiveObject.getEntries())) {
            this.active = false;
            this.stop(game);
            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.interactiveObject.getPosition());
    }

    stop(game: Phaser.Game): void {
        this.events.forEach((event) => {
            game.time.events.remove(event);
        });
        this.active = false;
    }

    getState(): STATE {
        return STATE.SIT;
    }
}
