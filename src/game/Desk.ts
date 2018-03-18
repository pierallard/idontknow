import {PositionTransformer} from "./PositionTransformer";

export class Desk {
    private deskSprite: Phaser.Sprite;
    private chairSprite: Phaser.Sprite;
    private position: PIXI.Point;

    constructor(game: Phaser.Game, group: Phaser.Group, point: PIXI.Point) {
        this.position = point;
        this.chairSprite = game.add.sprite(PositionTransformer.getRealPosition(point).x, PositionTransformer.getRealPosition(point).y, 'chair');
        this.deskSprite = game.add.sprite(PositionTransformer.getRealPosition(point).x, PositionTransformer.getRealPosition(point).y, 'desk');
        this.chairSprite.anchor.set(0.5, 1);
        this.deskSprite.anchor.set(0.5, 1);

        if (Math.random() >= 0.5) {
            this.deskSprite.scale.set(-1, 1);
            this.chairSprite.scale.set(-1, 1);
        }

        group.add(this.chairSprite);
        group.add(this.deskSprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}