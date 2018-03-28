import {Human} from "./Human";
import {HumanState} from "../human_states/HumanState";
import {FreezeState} from "../human_states/FreezeState";
import {SmokeState} from "../human_states/SmokeState";
import {SitState} from "../human_states/SitState";
import {MoveRandomState} from "../human_states/MoveRandomState";
import {World} from "../World";
import {ANIMATION, HumanAnimationManager} from "./HumanAnimationManager";
import {TypeState} from "../human_states/TypeState";

export class HumanStateManager {
    private human: Human;
    private state: HumanState;
    private world: World;
    private animationManager: HumanAnimationManager;

    constructor(human: Human) {
        this.human = human;
        this.state = new FreezeState(human);
    }

    create(game: Phaser.Game, world: World, animationManager: HumanAnimationManager) {
        this.state.start(game);
        this.world = world;
        this.animationManager = animationManager;
    }

    updateState(game: Phaser.Game) {
        if (!this.state.isActive()) {
            const states: HumanState[] = [
                new SmokeState(this.human, this.animationManager.getAnimationTime(ANIMATION.SMOKE)),
                new FreezeState(this.human),
                new MoveRandomState(this.human, this.world)
            ];
            const randomSofa = this.world.getRandomFreeSofa();
            if (randomSofa !== null) {
                states.push(new SitState(
                    this.human,
                    this.animationManager.getAnimationTime(ANIMATION.SIT_DOWN),
                    randomSofa,
                    this.world
                ));
            }
            const randomDesk = this.world.getRandomFreeDesk();
            if (randomDesk !== null) {
                states.push(new TypeState(
                    this.human,
                    this.animationManager.getAnimationTime(ANIMATION.SIT_DOWN),
                    randomDesk,
                    this.world
                ));
            }
            this.state = states[Math.floor(Math.random() * states.length)];
            this.state.start(game);
            console.log('New state: ' + this.state.constructor.name);
        }
    }
}