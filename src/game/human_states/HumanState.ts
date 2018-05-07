import {STATE} from "../human_stuff/HumanStateManager";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export interface HumanState {
    /**
     * Returns the next state of the human.
     * 3 possibilities:
     * - It returns the same state ; means the state has to be continued
     * - It returns a new state ; means it FORCED to this next state
     * - It returns null ; means the current state is ended, and let the stateManager decide.
     *
     * @returns {HumanState}
     */
    getNextState(): HumanState;
    start(game: Phaser.Game): boolean;
    stop(): void;
    getState(): STATE;
    getRageImage(): RAGE_IMAGE;
    getRemainingSeconds(): number;
}
