import {PositionTransformer} from "./PositionTransformer";
import {Human} from "./Human";

export class Cell extends Phaser.Sprite {
    private human: Human;
    private cell: PIXI.Point;

    constructor(game: Phaser.Game, point: PIXI.Point) {
        super(
            game,
            PositionTransformer.getRealPosition(point).x,
            PositionTransformer.getRealPosition(point).y,
            'woodcell'
        );

        this.cell = point;

        this.anchor.setTo(0.5, 1);

        this.game.add.existing(this);
    }

    setHuman(human: Human) {
        this.human = human;
    }

    getPosition(): PIXI.Point {
        return this.cell;
    }
}