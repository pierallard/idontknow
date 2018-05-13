import {PositionTransformer} from "./PositionTransformer";
import {DEBUG_WORLD} from "./WorldKnowledge";

export class Cell {
    private position: PIXI.Point;
    private sprite: Phaser.Sprite;

    constructor(point: PIXI.Point) {
        this.position = point;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        if (DEBUG_WORLD) {
            this.sprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.position).x,
                PositionTransformer.getRealPosition(this.position).y,
                'casedefault'
            );

            this.sprite.anchor.setTo(0.5, 1);
            this.sprite.alpha = 0.5;

            group.add(this.sprite);
        }
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}