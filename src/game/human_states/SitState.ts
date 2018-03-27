import {HumanState} from "./HumanState";
import {ANIMATION, Human, WALK_CELL_DURATION} from "../Human";
import {Sofa} from "../objects/Sofa";
import {World} from "../World";

export class SitState implements HumanState {
    private human: Human;
    private loopTime: number;
    private active: boolean;
    private sofa: Sofa;
    private game: Phaser.Game;
    private isHumanOnTheRightCell: boolean;
    private world: World;

    constructor(human: Human, loopTime: number, sofa: Sofa, world: World) {
        this.human = human;
        this.loopTime = loopTime;
        this.sofa = sofa;
        this.isHumanOnTheRightCell = false;
        this.world = world;
    }

    isActive(): boolean {
        if (!this.isHumanOnTheRightCell) {
            if (this.world.isSofaTaken(this.sofa)) {
                this.active = false;

                return false;
            }
        }
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.goToSofa(this.sofa.getPosition());
            this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                this.human.loadAnimation(ANIMATION.SIT_DOWN);
                this.game.time.events.add(Phaser.Math.random(1, 3) * Phaser.Timer.SECOND + this.loopTime, () => {
                    this.human.loadAnimation(ANIMATION.STAND_UP);
                    this.game.time.events.add(this.loopTime + 100, () => {
                        this.human.goToFreeCell();
                        this.game.time.events.add(WALK_CELL_DURATION + 100, () => {
                            this.active = false;
                        }, this);
                    }, this);
                }, this);
            }, this);
        }

        return this.active;
    }

    start(game: Phaser.Game): void {
        this.active = true;
        this.game = game;
        this.human.moveToClosest(this.sofa.getPosition());
    }


    private isNeighborPosition() {
        return !this.human.isMoving() && (this.human.getPosition().x - this.sofa.getPosition().x) * (this.human.getPosition().x - this.sofa.getPosition().x) +
            (this.human.getPosition().y - this.sofa.getPosition().y) * (this.human.getPosition().y - this.sofa.getPosition().y) === 1;
    }
}
