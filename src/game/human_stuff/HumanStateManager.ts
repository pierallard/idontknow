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
import {HumanHumorManager, HUMOR} from "./HumanHumorManager";

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
                console.log('State ' + this.state.constructor.name + ' failed. Retry.');
                this.updateState(game);
            }
        }
    }

    private randomNextStepName(): STATE {
        const states = [];
        states.push({state: STATE.SMOKE, probability: this.getProbability(STATE.SMOKE)});
        states.push({state: STATE.FREEZE, probability: this.getProbability(STATE.FREEZE)});
        states.push({state: STATE.MOVE_RANDOM, probability: this.getProbability(STATE.MOVE_RANDOM)});

        if (this.worldKnowledge.getAnotherFreeHuman(this.human) !== null) {
            states.push({state: STATE.TALK, probability: this.getProbability(STATE.TALK)});
        }

        if (this.worldKnowledge.getRandomFreeSofa() !== null) {
            states.push({state: STATE.SIT, probability: this.getProbability(STATE.SIT)});
        }
        if (this.worldKnowledge.getRandomFreeDesk() !== null) {
            states.push({state: STATE.TYPE, probability: this.getProbability(STATE.TYPE)});
        }

        if (this.worldKnowledge.getRandomFreeDispenser() !== null) {
            states.push({state: STATE.COFFEE, probability: this.getProbability(STATE.COFFEE)});
        }

        let debug = '';
        debug += 'Rlx[' + Math.ceil(this.human.getHumor(HUMOR.RELAXATION) * 100) + '%], ';
        debug += 'Hng[' + Math.ceil(this.human.getHumor(HUMOR.HUNGER) * 100) + '%], ';
        debug += 'Soc[' + Math.ceil(this.human.getHumor(HUMOR.SOCIAL) * 100) + '%] ---> ';
        debug += 'Smk(' + Math.ceil(this.getProbability(STATE.SMOKE)) + '), ' ;
        debug += 'Frz(' + Math.ceil(this.getProbability(STATE.FREEZE)) + '), ' ;
        debug += 'MvR(' + Math.ceil(this.getProbability(STATE.MOVE_RANDOM)) + '), ' ;
        debug += 'Tak(' + Math.ceil(this.getProbability(STATE.TALK)) + '), ' ;
        debug += 'Sit(' + Math.ceil(this.getProbability(STATE.SIT)) + '), ' ;
        debug += 'Typ(' + Math.ceil(this.getProbability(STATE.TYPE)) + '), ' ;
        debug += 'Cof(' + Math.ceil(this.getProbability(STATE.COFFEE)) + '), ' ;
        console.log(debug);

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

    private getProbability(state: STATE): number {
        let result = 1;
        switch(state) {
            case STATE.SMOKE: result = 5; break;
            case STATE.FREEZE: result = 1; break;
            case STATE.MOVE_RANDOM: result = 2; break;
            case STATE.TALK: result = 8; break;
            case STATE.SIT: result = 2; break;
            case STATE.COFFEE: result = 6; break;
            case STATE.TYPE: result = 5 + 1 + 2 + 8 + 2 + 6; break;
        }

        if (state === this.state.getState()) {
            result = result / 10;
        }

        HumanHumorManager.getHumors().forEach((humor: HUMOR) => {
            if (this.human.getHumor(humor) < 0.5) {
                if (HumanStateManager.getHumorGains(state)[humor] > 0) {
                    result = result * HumanStateManager.getHumorGains(state)[humor] * 8;
                    result = result * (1 - this.human.getHumor(humor)) * 3;
                }
            }
        });

        return result;
    }

    static getHumorGains(state: STATE): object {
        let result = {};
        switch(state) {
            case STATE.SMOKE: result[HUMOR.RELAXATION] = 0.4; break;
            case STATE.TALK: result[HUMOR.SOCIAL] = 0.5; break;
            case STATE.SIT: result[HUMOR.RELAXATION] = 0.2; break;
            case STATE.COFFEE: result[HUMOR.HUNGER] = 0.5; break;
        }

        return result;
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