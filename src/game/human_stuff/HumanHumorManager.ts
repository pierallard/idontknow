import {HumanStateManager, STATE} from "./HumanStateManager";

const LOSS = -0.05;
const DEFAULT = 0.75;

export enum HUMOR {
    RELAXATION,
    HUNGER,
    SOCIAL
}

export class HumanHumorManager {
    private humors: object;
    private game: Phaser.Game;
    private hasToBeUpdated: boolean;

    constructor() {
        this.humors = {};
        this.humors[HUMOR.RELAXATION] = DEFAULT;
        this.humors[HUMOR.HUNGER] = DEFAULT;
        this.humors[HUMOR.SOCIAL] = DEFAULT;
        this.hasToBeUpdated = true;
    }

    create(game: Phaser.Game) {
        this.game = game;
    }

    update() {
        if (this.hasToBeUpdated) {
            let humorUpdate = {};
            humorUpdate[HUMOR.RELAXATION] = LOSS;
            humorUpdate[HUMOR.HUNGER] = LOSS;
            humorUpdate[HUMOR.SOCIAL] = LOSS;
            this.updateFromStateInner(humorUpdate);
            this.hasToBeUpdated = false;

            this.game.time.events.add(10 * Phaser.Timer.SECOND, () => {
                this.hasToBeUpdated = true;
            }, this);
        }
    }

    updateFromState(state: STATE) {
        this.updateFromStateInner(HumanStateManager.getHumorGains(state));
    }

    private updateFromStateInner(humors: object) {
        Object.keys(humors).forEach((humor) => {
            this.humors[humor] = Math.max(0, Math.min(1, this.humors[humor] + humors[humor]));
        });
    }

    static getHumors(): HUMOR[] {
        return [
            HUMOR.RELAXATION,
            HUMOR.HUNGER,
            HUMOR.SOCIAL
        ];
    }

    getHumor(humor: HUMOR): number {
        return this.humors[humor];
    }

    getGeneralHumor() {
        return (this.humors[HUMOR.RELAXATION] + this.humors[HUMOR.SOCIAL] + this.humors[HUMOR.HUNGER]) / 3;
    }
}