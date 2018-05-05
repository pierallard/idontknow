import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {RageState} from "./RageState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class MoveRandomState extends AbstractState {
    private goal: PIXI.Point;

    constructor(human: Employee, worldKnowledge: WorldKnowledge) {
        super(human);

        this.goal = worldKnowledge.getRandomCell();
        while (this.human.getPosition().x === this.goal.x && this.human.getPosition().y === this.goal.y) {
            this.goal = worldKnowledge.getRandomCell();
        }
    }

    getNextState(): HumanState {
        return (this.active && this.human.getPosition().x !== this.goal.x ||
            this.human.getPosition().y !== this.goal.y ||
            this.human.isMoving()) ? this : null;
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        if (!this.human.moveTo(this.goal)) {
            this.stop();
            return false;
        }

        return true;
    }

    getState(): STATE {
        return STATE.MOVE_RANDOM;
    }

    getRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.PATH;
    }
}
