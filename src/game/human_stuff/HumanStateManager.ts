import {Human} from "./Human";
import {HumanState} from "../human_states/HumanState";
import {FreezeState} from "../human_states/FreezeState";
import {SmokeState} from "../human_states/SmokeState";
import {SitState} from "../human_states/SitState";
import {MoveRandomState} from "../human_states/MoveRandomState";
import {World} from "../World";
import {HumanAnimationManager} from "./HumanAnimationManager";
import {TypeState} from "../human_states/TypeState";
import {TalkState} from "../human_states/TalkState";
import {Meeting} from "../human_states/Meeting";

export enum STATE {
    SMOKE,
    FREEZE,
    MOVE_RANDOM,
    SIT,
    TYPE,
    TALK,
}

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
            switch(this.randomNextStepName()) {
                case STATE.SMOKE:
                    this.state = new SmokeState(this.human);
                    break;
                case STATE.MOVE_RANDOM:
                    this.state = new MoveRandomState(this.human, this.world);
                    break;
                case STATE.SIT:
                    this.state = new SitState(
                        this.human,
                        this.world.getRandomFreeSofa(),
                        this.world
                    );
                    break;
                case STATE.TYPE:
                    this.state = new TypeState(
                        this.human,
                        this.world.getRandomFreeDesk(),
                        this.world
                    );
                    break;
                case STATE.TALK:
                    this.state = new TalkState(this.human, this.world.getAnotherFreeHuman(this.human), game, this.world);
                    break;
                case STATE.FREEZE:
                default:
                    this.state = new FreezeState(this.human);
            }

            if (this.state.start(game)) {
                console.log('New state: ' + this.state.constructor.name);
            } else {
                console.log('State ' + this.state.constructor.name + ' failed. Retry.')
                this.updateState(game);
            }
        }
    }

    private randomNextStepName(): STATE {
        const states = [];
        states.push({state: STATE.SMOKE, probability: 5});
        states.push({state: STATE.FREEZE, probability: 1});
        states.push({state: STATE.MOVE_RANDOM, probability: 2});

        if (this.world.getAnotherFreeHuman(this.human) !== null) {
            states.push({state: STATE.TALK, probability: 8});
        }

        if (this.world.getRandomFreeSofa() !== null) {
            states.push({state: STATE.SIT, probability: 2});
        }
        if (this.world.getRandomFreeDesk() !== null) {
            states.push({state: STATE.TYPE, probability: 25});
        }

        states.forEach((state) => {
            if (state.state === this.state.getState()) {
                state.probability = state.probability / 10;
            }
        });

        const sum = states.reduce((prev, state) => {
            return prev + state.probability;
        }, 0);

        const random = Phaser.Math.random(0, sum);
        let counter = 0;
        for (let i = 0; i < states.length; i++) {
            counter += states[i].probability;
            if (counter > random) {
                return states[i].state;
            }
        }
    }

    reset(game: Phaser.Game) {
        this.state.stop(game);
        this.updateState(game);
    }

    goMeeting(game: Phaser.Game, meeting: Meeting): boolean {
        this.state.stop(game);
        this.state = new TalkState(this.human, null, game, this.world, meeting);
        
        return this.state.start(game);
    }

    getState() {
        return this.state.getState();
    }
}