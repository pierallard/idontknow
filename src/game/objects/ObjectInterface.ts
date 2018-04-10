export interface ObjectInterface {
    getPosition(): any;
    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }): void;
}
