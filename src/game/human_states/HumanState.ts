import {STATE} from "../human_stuff/HumanStateManager";

export interface HumanState {
    isActive(): boolean;
    start(game: Phaser.Game): void;
    stop(game: Phaser.Game): void;
    getState(): STATE;
}