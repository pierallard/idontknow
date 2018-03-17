import {PositionTransformer} from "./PositionTransformer";

export class Cell extends Phaser.Sprite {
    constructor(game: Phaser.Game, point: PIXI.Point) {
        super(
            game,
            PositionTransformer.getRealPosition(point).x,
            PositionTransformer.getRealPosition(point).y,
            'woodcell'
        );

        this.anchor.setTo(0.5, 1);

        this.game.add.existing(this);
    }
}