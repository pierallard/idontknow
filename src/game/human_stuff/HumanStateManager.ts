import {Employee} from "./Employee";
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
import {HumanMoodManager, MOOD} from "./HumanMoodManager";
import {TableMeeting} from "../human_states/TableMeeting";
import {SitTalkState} from "../human_states/SitTalkState";
import {Table} from "../objects/Table";
import {RageState} from "../human_states/RageState";
import {RAGE_IMAGE} from "./ThoughtBubble";

const LIMIT = 0.8;

export enum STATE {
    SMOKE,
    FREEZE,
    MOVE_RANDOM,
    SIT,
    TYPE,
    TALK,
    COFFEE,
    RAGE,
    SIT_TALK,
}

export class HumanStateManager {
    private human: Employee;
    private state: HumanState;
    private worldKnowledge: WorldKnowledge;
    private animationManager: HumanAnimationManager;

    constructor(human: Employee) {
        this.human = human;
        this.state = new FreezeState(human);
    }

    create(game: Phaser.Game, worldKnowledge: WorldKnowledge, animationManager: HumanAnimationManager) {
        this.state.start(game);
        this.worldKnowledge = worldKnowledge;
        this.animationManager = animationManager;
    }

    updateState(game: Phaser.Game) {
        const nextState = this.state.getNextState();
        if (nextState === this.state) {
            // Do nothing, current state is not ended.
            return;
        }

        if (nextState !== null) {
            // Next state is forced.
            this.state = nextState;
            this.state.start(game);
            console.log('New forced state: ' + this.state.constructor.name);
            return;
        }

        // Generates new state
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
                    this.worldKnowledge.getClosestReferer(['Sofa'], 1, this.human.getPosition()),
                    this.worldKnowledge
                );
                break;
            case STATE.TYPE:
                this.state = new TypeState(
                    this.human,
                    this.worldKnowledge.getClosestReferer(['Desk'], 1, this.human.getPosition()),
                    this.worldKnowledge
                );
                break;
            case STATE.COFFEE:
                this.state = new CoffeeState(
                    this.human,
                    this.worldKnowledge.getClosestReferer(['Dispenser'], 1, this.human.getPosition()),
                    this.worldKnowledge
                );
                break;
            case STATE.TALK:
                this.state = new TalkState(
                    this.human,
                    this.worldKnowledge.getAnotherFreeHuman(this.human),
                    this.worldKnowledge
                );
                break;
            case STATE.SIT_TALK:
                this.state = new SitTalkState(
                    this.human,
                    <Table> this.worldKnowledge.getClosestReferer(['Table'], 4, this.human.getPosition()).getObject(),
                    this.worldKnowledge.getAnotherFreeHumans(this.human, 3),
                    this.worldKnowledge
                );
                break;
            case STATE.FREEZE:
            default:
                this.state = new FreezeState(this.human);
        }

        if (this.state.start(game)) {
            console.log('New random state: ' + this.state.constructor.name);
        } else {
            console.log('State ' + this.state.constructor.name + ' failed. Retry.');
            this.updateState(game);
        }
    }

    private randomNextStepName(): STATE {
        const states = this.getNextProbabilities();

        let debug = '';
        debug += 'Rlx[' + Math.ceil(this.human.getMood(MOOD.RELAXATION) * 100) + '%], ';
        debug += 'Hng[' + Math.ceil(this.human.getMood(MOOD.HUNGER) * 100) + '%], ';
        debug += 'Soc[' + Math.ceil(this.human.getMood(MOOD.SOCIAL) * 100) + '%] ---> ';
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

    getNextProbabilities(): {probability: number, state: STATE}[] {
        const states = [];

        if (this.worldKnowledge.getClosestReferer(['Desk']) !== null) {
            states.push({state: STATE.TYPE, probability: this.getProbability(STATE.TYPE)});
        }

        if (
            this.worldKnowledge.getClosestReferer(['Table'], 4) !== null &&
            this.worldKnowledge.getAnotherFreeHumans(this.human, 3).length === 3
        ) {
            states.push({state: STATE.SIT_TALK, probability: this.getProbability(STATE.SIT_TALK)});
        }

        if (this.worldKnowledge.getClosestReferer(['Dispenser']) !== null) {
            states.push({state: STATE.COFFEE, probability: this.getProbability(STATE.COFFEE)});
        }

        if (this.worldKnowledge.getClosestReferer(['Sofa']) !== null) {
            states.push({state: STATE.SIT, probability: this.getProbability(STATE.SIT)});
        }

        if (this.worldKnowledge.getAnotherFreeHuman(this.human) !== null) {
            states.push({state: STATE.TALK, probability: this.getProbability(STATE.TALK)});
        }

        states.push({state: STATE.FREEZE, probability: this.getProbability(STATE.FREEZE)});
        states.push({state: STATE.MOVE_RANDOM, probability: this.getProbability(STATE.MOVE_RANDOM)});
        states.push({state: STATE.SMOKE, probability: this.getProbability(STATE.SMOKE)});

        return states;
    }

    private getProbability(state: STATE): number {
        let result = 1;
        switch(state) {
            case STATE.SMOKE: result = 5; break;
            case STATE.FREEZE: result = 3; break;
            case STATE.MOVE_RANDOM: result = 2; break;
            case STATE.TALK: result = 8; break;
            case STATE.SIT: result = 4; break;
            case STATE.COFFEE: result = 6; break;
            case STATE.SIT_TALK: result = 6; break;
            case STATE.TYPE: result = (5 + 1 + 2 + 8 + 2 + 6 + 6); break;
        }

        if (state === this.state.getState()) {
            result = result / 2;
        }
        if (this.state instanceof RageState) {
            const rageState = <RageState> this.state;
            if (rageState.getRageImage() === RAGE_IMAGE.COFFEE && state === STATE.COFFEE) {
                result = result / 3;
            }
            if (rageState.getRageImage() === RAGE_IMAGE.LAPTOP && state === STATE.TYPE) {
                result = result / 3;
            }
            if (rageState.getRageImage() === RAGE_IMAGE.SLEEP && state === STATE.SIT) {
                result = result / 3;
            }
            if (rageState.getRageImage() === RAGE_IMAGE.TABLE && state === STATE.SIT_TALK) {
                result = result / 3;
            }
        }

        HumanMoodManager.getMoods().forEach((mood: MOOD) => {
            if (this.human.getMood(mood) < LIMIT) {
                if (HumanStateManager.getMoodGains(state)[mood] > 0) {
                    let ratio = 1 - this.human.getMood(mood) / LIMIT;
                    ratio = ratio * HumanStateManager.getMoodGains(state)[mood] * 8;
                    result = result * (1 + ratio);
                }
            }
        });

        return result;
    }

    static getMoodGains(state: STATE): object {
        let result = {};
        switch(state) {
            case STATE.SMOKE: result[MOOD.RELAXATION] = 0.1; break;
            case STATE.TALK: result[MOOD.SOCIAL] = 0.5; break;
            case STATE.SIT: result[MOOD.RELAXATION] = 0.2; break;
            case STATE.COFFEE: result[MOOD.HUNGER] = 0.5; break;
            case STATE.SIT_TALK: result[MOOD.SOCIAL] = 0.6; break;
        }

        return result;
    }

    reset(game: Phaser.Game) {
        this.state.stop();
        this.updateState(game);
    }

    goMeeting(game: Phaser.Game, meeting: Meeting): boolean {
        this.state.stop();
        this.state = new TalkState(this.human, null, this.worldKnowledge, meeting);

        return this.state.start(game);
    }

    goSitMeeting(game: Phaser.Game, meeting: TableMeeting): boolean {
        this.state.stop();
        this.state = new SitTalkState(this.human, meeting.getTable(), meeting.getAnotherHumans(this.human), this.worldKnowledge, meeting);

        return this.state.start(game);
    }

    getState() {
        return this.state.getState();
    }

    static getStr(state: STATE) {
        switch (state) {
            case STATE.SMOKE: return 'Smoke';
            case STATE.FREEZE: return 'Freeze';
            case STATE.MOVE_RANDOM: return 'Move';
            case STATE.SIT: return 'Sit';
            case STATE.TYPE: return 'Work';
            case STATE.TALK: return 'Talk';
            case STATE.COFFEE: return 'Coffee';
            case STATE.RAGE: return 'Rage';
            case STATE.SIT_TALK: return 'Meeting';
        }
    }
}
