import {PositionTransformer} from "./PositionTransformer";
import {Point} from "./Point";
import {GROUP_FLOOR} from "./game_state/Play";

export class Floor {
    private position: Point;
    private sprite: Phaser.Sprite;
    private key: string;

    constructor(point: Point, key = 'woodcell') {
        this.position = point;
        this.key = key;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            this.key
        );

        this.sprite.anchor.setTo(0.5, (1 + 2.1) / 2);

        groups[GROUP_FLOOR + this.position.z].add(this.sprite);
    }

    getPosition(): Point {
        return this.position;
    }
}
