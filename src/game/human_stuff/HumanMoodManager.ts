import {HumanStateManager, STATE} from "./HumanStateManager";

const LOSS = -0.05;
const DEFAULT = 0.75;

export enum MOOD {
    RELAXATION,
    HUNGER,
    SOCIAL
}

export class HumanMoodManager {
    private moods: object;
    private game: Phaser.Game;
    private hasToBeUpdated: boolean;

    constructor() {
        this.moods = {};
        this.moods[MOOD.RELAXATION] = DEFAULT;
        this.moods[MOOD.HUNGER] = DEFAULT;
        this.moods[MOOD.SOCIAL] = DEFAULT;
        this.hasToBeUpdated = true;
    }

    create(game: Phaser.Game) {
        this.game = game;
    }

    update() {
        if (this.hasToBeUpdated) {
            let moodUpdate = {};
            moodUpdate[MOOD.RELAXATION] = LOSS;
            moodUpdate[MOOD.HUNGER] = LOSS;
            moodUpdate[MOOD.SOCIAL] = LOSS / 2;
            this.updateFromStateInner(moodUpdate);
            this.hasToBeUpdated = false;

            this.game.time.events.add(10 * Phaser.Timer.SECOND, () => {
                this.hasToBeUpdated = true;
            }, this);
        }
    }

    updateFromState(state: STATE) {
        this.updateFromStateInner(HumanStateManager.getMoodGains(state));
    }

    private updateFromStateInner(moods: object) {
        Object.keys(moods).forEach((mood) => {
            this.moods[mood] = Math.max(0, Math.min(1, this.moods[mood] + moods[mood]));
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
        return this.moods[mood];
    }

    getGeneralMood() {
        return (this.moods[MOOD.RELAXATION] + this.moods[MOOD.SOCIAL] + this.moods[MOOD.HUNGER]) / 3;
    }
}
