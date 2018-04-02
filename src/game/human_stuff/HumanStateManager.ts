import {Human} from "./Human";
import {HumanState} from "../human_states/HumanState";
import {FreezeState} from "../human_states/FreezeState";
import {SmokeState} from "../human_states/SmokeState";
import {SitState} from "../human_states/SitState";
import {MoveRandomState} from "../human_states/MoveRandomState";
import {WorldKnowledge} from "../WorldKnowledge";
import {HumanAnimationManager} from "./HumanAnimationManager";
import {TypeState} from "../human_states/TypeState";
import {TalkState} from "../human_states/TalkState";
import {Meeting} from "../human_states/Meeting";
import {CoffeeState} from "../human_states/CoffeeState";

export enum STATE {
    SMOKE,
    FREEZE,
    MOVE_RANDOM,
    SIT,
    TYPE,
    TALK,
    COFFEE,
}

export class HumanStateManager {
    private human: Human;
    private state: HumanState;
    private worldKnowledge: WorldKnowledge;
    private animationManager: HumanAnimationManager;

    constructor(human: Human) {
        this.human = human;
        this.state = new FreezeState(human);
    }

    create(game: Phaser.Game, worldKnowledge: WorldKnowledge, animationManager: HumanAnimationManager) {
        this.state.start(game);
        this.worldKnowledge = worldKnowledge;
        this.animationManager = animationManager;
    }

    updateState(game: Phaser.Game) {
        if (!this.state.isActive()) {
            switch(this.randomNextStepName()) {
                case STATE.SMOKE:
                    this.state = new SmokeState(this.human);
                    break;
                case STATE.MOVE_RANDOM:
                    this.state = new MoveRandomState(this.human, this.worldKnowledge);
                    break;
                case STATE.SIT:
                    this.state = new SitState(
                        this.human,
                        this.worldKnowledge.getRandomFreeSofa(),
                        this.worldKnowledge
                    );
                    break;
                case STATE.TYPE:
                    this.state = new TypeState(
                        this.human,
                        this.worldKnowledge.getRandomFreeDesk(),
                        this.worldKnowledge
                    );
                    break;
                case STATE.COFFEE:
                    this.state = new CoffeeState(
                        this.human,
                        this.worldKnowledge.getRandomFreeDispenser(),
                        this.worldKnowledge
                    );
                    break;
                case STATE.TALK:
                    this.state = new TalkState(this.human, this.worldKnowledge.getAnotherFreeHuman(this.human), game, this.worldKnowledge);
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

        if (this.worldKnowledge.getAnotherFreeHuman(this.human) !== null) {
            states.push({state: STATE.TALK, probability: 8});
        }

        if (this.worldKnowledge.getRandomFreeSofa() !== null) {
            states.push({state: STATE.SIT, probability: 2});
        }
        if (this.worldKnowledge.getRandomFreeDesk() !== null) {
            states.push({state: STATE.TYPE, probability: 25});
        }

        if (this.worldKnowledge.getRandomFreeDispenser() !== null) {
            states.push({state: STATE.COFFEE, probability: 6});
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
        this.state = new TalkState(this.human, null, game, this.worldKnowledge, meeting);

        return this.state.start(game);
    }

    getState() {
        return this.state.getState();
    }
}