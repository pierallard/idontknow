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
import {MeetingTable} from "../objects/MeetingTable";
import {RageState} from "../human_states/RageState";
import {SitPlay} from "../human_states/SitPlay";
import {ObjectDescriptionRegistry} from "../objects/ObjectDescriptionRegistry";

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
    SIT_PLAY
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
            return;
        }

        if (nextState !== null) {
            this.state = nextState;
        } else {
            // Generates new state
            switch (this.randomNextStepName()) {
                case STATE.SMOKE:
                    this.state = new SmokeState(this.human);
                    break;
                case STATE.MOVE_RANDOM:
                    this.state = new MoveRandomState(this.human, this.worldKnowledge);
                    break;
                case STATE.SIT:
                    this.state = new SitState(
                        this.human,
                        this.worldKnowledge
                    );
                    break;
                case STATE.TYPE:
                    this.state = new TypeState(
                        this.human,
                        this.worldKnowledge
                    );
                    break;
                case STATE.COFFEE:
                    this.state = new CoffeeState(
                        this.human,
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
                    const freeHumans = [
                        this.worldKnowledge.getAnotherFreeHumans(this.human, 3),
                        this.worldKnowledge.getAnotherFreeHumans(this.human, 2),
                        this.worldKnowledge.getAnotherFreeHumans(this.human, 1)
                    ].filter((freeHuman) => {
                        return freeHuman.length > 0;
                    })[0];
                    const tableReferer = this.worldKnowledge.getClosestReferer(['Meeting Table'], 4, this.human.getPosition());
                    console.log(tableReferer);
                    this.state = new SitTalkState(
                        this.human,
                        tableReferer ? (<MeetingTable> tableReferer.getObject()) : null,
                        freeHumans,
                        this.worldKnowledge
                    );
                    break;
                case STATE.SIT_PLAY:
                    this.state = new SitPlay(
                        this.human,
                        this.worldKnowledge
                    );
                    break;
                case STATE.FREEZE:
                default:
                    this.state = new FreezeState(this.human);
            }
        }

        if (!this.state.start(game)) {
            console.log('State ' + this.state.constructor.name + ' failed to start. Rage!');
            this.state = new RageState(this.human, this.state);
            this.state.start(game);
        }
    }

    private randomNextStepName(): STATE {
        const states = this.getNextProbabilities();
        return HumanStateManager.getRandomWithProbabilities(states);
    }

    static getRandomWithProbabilities(states: {[index: number]: number}): number {
        const sum = Object.keys(states).reduce((prev, key) => {
            return prev + states[key];
        }, 0);

        const random = Phaser.Math.random(0, sum);
        let counter = 0;
        for (let i = 0; i < Object.keys(states).length; i++) {
            counter += states[Object.keys(states)[i]];
            if (counter > random) {
                return parseInt(Object.keys(states)[i]);
            }
        }

        debugger;
    }

    getNextProbabilities(): {[index: number]: number} {
        const states = {};

        if (this.worldKnowledge.getHumanCount() > 1) {
            states[STATE.TALK] = this.getProbability(STATE.TALK);
        }

        states[STATE.TYPE] = this.getProbability(STATE.TYPE);
        states[STATE.COFFEE] = this.getProbability(STATE.COFFEE);
        states[STATE.SIT] = this.getProbability(STATE.SIT);
        states[STATE.FREEZE] = this.getProbability(STATE.FREEZE);
        states[STATE.MOVE_RANDOM] = this.getProbability(STATE.MOVE_RANDOM);
        states[STATE.SMOKE] = this.getProbability(STATE.SMOKE);

        if (this.worldKnowledge.getLevel() >= ObjectDescriptionRegistry.getObjectDescription('Console').getMinLevel()) {
            states[STATE.SIT_PLAY] = this.getProbability(STATE.SIT_PLAY);
        }

        if (this.worldKnowledge.getLevel() >= ObjectDescriptionRegistry.getObjectDescription('Meeting Table').getMinLevel()) {
            states[STATE.SIT_TALK] = this.getProbability(STATE.SIT_TALK);
        }

        return states;
    }

    private getProbability(state: STATE): number {
        let result = 1;
        switch(state) {
            case STATE.SMOKE: result = 5; break;
            case STATE.FREEZE: result = 3; break;
            case STATE.MOVE_RANDOM: result = 2; break;
            case STATE.TALK: result = 8; break;
            case STATE.SIT: result = 5; break;
            case STATE.COFFEE: result = 6; break;
            case STATE.SIT_TALK: result = 6; break;
            case STATE.SIT_PLAY: result = 3; break;
            case STATE.TYPE: result = (5 + 3 + 2 + 8 + 5 + 6 + 6 + 3); break;
        }

        if (state === this.state.getState()) {
            result = result / 1.5;
        }
        if (this.state instanceof RageState) {
            const rageState = <RageState> this.state;
            if (rageState.getSourceState().getState() === state) {
                result = result / 3;
            }
        }

        if (state === STATE.TYPE && this.worldKnowledge.getLevelProgress(this.human.getType()) >= 1) {
            result = result / 20;
        }

        HumanMoodManager.getMoods().forEach((mood: MOOD) => {
            if (this.human.getMood(mood) < LIMIT) {
                if (HumanStateManager.getMoodGains(state)[mood] > 0) {
                    let ratio = 1 - this.human.getMood(mood) / LIMIT;
                    ratio = ratio * HumanStateManager.getMoodGains(state)[mood] * 30;
                    result = result * (1 + ratio);
                }
            }
        });

        return result;
    }

    static getMoodGains(state: STATE): {[index: number]: number} {
        let result = {};
        switch(state) {
            case STATE.SMOKE: result[MOOD.RELAXATION] = 0.1; break;
            case STATE.TALK: result[MOOD.SOCIAL] = 0.4; result[MOOD.RELAXATION] = 0.1; break;
            case STATE.SIT: result[MOOD.RELAXATION] = 0.35; break;
            case STATE.COFFEE: result[MOOD.HUNGER] = 0.5; result[MOOD.RELAXATION] = -0.05; break;
            case STATE.SIT_TALK: result[MOOD.SOCIAL] = 0.6; break;
            case STATE.RAGE: result[MOOD.RELAXATION] = -0.1; break;
            case STATE.SIT_PLAY: result[MOOD.RELAXATION] = 0.4; result[MOOD.SOCIAL] = 0.2; break;
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

    getStateType(): STATE {
        return this.state.getState();
    }

    getState(): HumanState {
        return this.state;
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
            case STATE.SIT_PLAY: return 'Play';
        }
    }
}
