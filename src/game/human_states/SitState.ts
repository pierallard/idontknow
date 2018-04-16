import {HumanState} from "./HumanState";
import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {InteractiveObjectInterface} from "../objects/InteractiveObjectInterface";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {PositionTransformer} from "../PositionTransformer";
import {RageState} from "./RageState";

export class SitState implements HumanState {
    private human: Employee;
    private active: boolean;
    private interactiveObject: InteractiveObjectInterface;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private worldKnowledge: WorldKnowledge;
    private events: Phaser.TimerEvent[];
    private tries: number;

    constructor(human: Employee, interactiveObject: InteractiveObjectInterface, worldKnowledge: WorldKnowledge, tries: number = 0) {
        this.human = human;
        this.interactiveObject = interactiveObject;
        this.isHumanOnTheRightCell = false;
        this.worldKnowledge = worldKnowledge;
        this.events = [];
        this.tries = tries;
    }

    getNextState(): HumanState {
        if (!this.isHumanOnTheRightCell) {
            if (!this.worldKnowledge.hasObject(this.interactiveObject) || this.worldKnowledge.isObjectUsed(this.interactiveObject)) {
                const nextSofa = this.worldKnowledge.getRandomFreeSittable();
                if (this.tries > this.human.getMaxRetries() || nextSofa === null) {
                    this.active = false;
                    this.human.stopWalk();

                    return new RageState(this.human);
                } else {
                    return new SitState(this.human, nextSofa, this.worldKnowledge, this.tries + 1);
                }
            }
        }
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.interactiveObject, this.interactiveObject.forceOrientation());
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.human.loadAnimation(ANIMATION.SIT_DOWN, this.interactiveObject.forceOrientation());
                this.human.updateMoodFromState();
                this.events.push(this.game.time.events.add(Phaser.Math.random(3, 10) * Phaser.Timer.SECOND + HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
                    this.human.loadAnimation(ANIMATION.STAND_UP);
                    this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                        this.human.goToFreeCell(this.interactiveObject.getEntries());
                        this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                            this.active = false;
                        }, this));
                    }, this));
                }, this));
            }, this));
        }

        return this.active ? this : null;
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
