import {HumanStateManager, STATE} from "./HumanStateManager";
import {SmoothValue} from "../SmoothValue";

const LOSS = -0.025;
const DEFAULT = 0.8;
const TIME_BETWEEN_LOSS = 10000;

export enum MOOD {
    RELAXATION,
    HUNGER,
    SOCIAL
}

export class HumanMoodManager {
    private moods: {[index: number]: SmoothValue};
    private game: Phaser.Game;
    private hasToBeUpdated: boolean;

    constructor() {
        this.moods = {};
        this.moods[MOOD.RELAXATION] = new SmoothValue(DEFAULT);
        this.moods[MOOD.HUNGER] = new SmoothValue(DEFAULT);
        this.moods[MOOD.SOCIAL] = new SmoothValue(DEFAULT);
        this.moods[MOOD.RELAXATION].setMaxValue(1);
        this.moods[MOOD.HUNGER].setMaxValue(1);
        this.moods[MOOD.SOCIAL].setMaxValue(1);
        this.moods[MOOD.RELAXATION].setMinValue(0);
        this.moods[MOOD.HUNGER].setMinValue(0);
        this.moods[MOOD.SOCIAL].setMinValue(0);

        this.hasToBeUpdated = true;
    }

    create(game: Phaser.Game) {
        this.game = game;
    }

    update() {
        this.moods[MOOD.RELAXATION].update();
        this.moods[MOOD.HUNGER].update();
        this.moods[MOOD.SOCIAL].update();

        if (this.hasToBeUpdated) {
            let moodUpdate = {};
            moodUpdate[MOOD.RELAXATION] = LOSS;
            moodUpdate[MOOD.HUNGER] = LOSS;
            moodUpdate[MOOD.SOCIAL] = LOSS / 2;
            this.updateFromStateInner(moodUpdate, TIME_BETWEEN_LOSS);
            this.hasToBeUpdated = false;

            this.game.time.events.add(TIME_BETWEEN_LOSS, () => {
                this.hasToBeUpdated = true;
            }, this);
        }
    }

    updateFromState(state: STATE) {
        this.updateFromStateInner(HumanStateManager.getMoodGains(state), 5 * Phaser.Timer.SECOND);
    }

    private updateFromStateInner(moods: {[index: number]: number}, time: number = Phaser.Timer.SECOND) {
        Object.keys(moods).forEach((mood) => {
            this.moods[parseInt(mood)].add(moods[parseInt(mood)], time);
        });
    }

    static getMoods(): MOOD[] {
        return [
            MOOD.RELAXATION,
            MOOD.HUNGER,
            MOOD.SOCIAL
        ];
    }

    getMood(mood: MOOD): number {
        return this.moods[mood].getValue();
    }

    getGeneralMood() {
        return (this.moods[MOOD.RELAXATION].getValue() + this.moods[MOOD.SOCIAL].getValue() + this.moods[MOOD.HUNGER].getValue()) / 3;
    }
}
