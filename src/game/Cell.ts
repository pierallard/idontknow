import {PositionTransformer} from "./PositionTransformer";
import {DEBUG_WORLD} from "./WorldKnowledge";

export class Cell {
    private position: PIXI.Point;
    private sprite: Phaser.Sprite;
    private key: string;

    constructor(point: PIXI.Point, key = 'woodcell') {
        this.position = point;
        this.key = key;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            DEBUG_WORLD ? 'casedefault' : this.key
        );

        this.sprite.anchor.setTo(0.5, 1);

        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}