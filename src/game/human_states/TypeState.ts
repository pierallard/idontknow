import {HumanState} from "./HumanState";
import {Human, WALK_CELL_DURATION} from "../human_stuff/Human";
import {World} from "../World";
import {SittableInterface} from "../objects/SittableInterface";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";

export class TypeState implements HumanState {
    private human: Human;
    private active: boolean;
    private sittable: SittableInterface;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private world: World;
    private events: Phaser.TimerEvent[];

    constructor(human: Human, sittable: SittableInterface, world: World) {
        this.human = human;
        this.sittable = sittable;
        this.isHumanOnTheRightCell = false;
        this.world = world;
        this.events = [];
    }

    isActive(): boolean {
        if (!this.isHumanOnTheRightCell) {
            if (this.world.isSittableTaken(this.sittable)) {
                this.active = false;

                return false;
            }
        }
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.goToSittable(this.sittable, this.sittable.forceOrientation());
            this.events.push(this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                this.human.loadAnimation(ANIMATION.SIT_DOWN, this.sittable.forceOrientation());
                this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
                    this.human.loadAnimation(ANIMATION.TYPE);
                    this.events.push(this.game.time.events.add(Phaser.Math.random(5, 10) * Phaser.Timer.SECOND, () => {
                        this.human.loadAnimation(ANIMATION.STAND_UP);
                        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                            this.human.goToFreeCell(this.sittable.getEntries());
                            this.events.push(this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                                this.active = false;
                            }, this));
                        }, this));
                    }, this));
                }));
            }, this));
        }

        return this.active;
    }

    start(game: Phaser.Game): boolean {
        this.active = true;
        this.game = game;
        if (!this.human.moveToClosest(this.sittable.getPosition(), this.sittable.getEntries())) {
            this.active = false;

            return false;
        }

        return true;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() && (this.human.getPosition().x - this.sittable.getPosition().x) * (this.human.getPosition().x - this.sittable.getPosition().x) +
            (this.human.getPosition().y - this.sittable.getPosition().y) * (this.human.getPosition().y - this.sittable.getPosition().y) === 1;
    }

    stop(game: Phaser.Game): void {
        this.events.forEach((event) => {
            game.time.events.remove(event);
        });
        this.active = false;
    }


    getState(): STATE {
        return STATE.TYPE;
    }
}
