import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "./PositionTransformer";

export class Cell extends Phaser.Graphics {
    constructor(game: Phaser.Game, point: PIXI.Point) {
        super(game, PositionTransformer.getRealPosition(point).x, PositionTransformer.getRealPosition(point).y);
        this.game.add.existing(this);

        this.lineStyle(1, 0xffffff);
        this.moveTo(0, 0);
        this.lineTo(-CELL_WIDTH/2, -CELL_HEIGHT/2);
        this.lineTo(0, -CELL_HEIGHT);
        this.lineTo(CELL_WIDTH/2, -CELL_HEIGHT/2);
        this.lineTo(0, 0);
    }
}