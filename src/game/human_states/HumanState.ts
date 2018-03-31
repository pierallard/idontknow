export interface HumanState {
    isActive(): boolean;
    start(game: Phaser.Game): void;
    stop(game: Phaser.Game): void;
}