import {Wall, WALL_ALPHA} from "./Wall";
import {PositionTransformer} from "../PositionTransformer";

const FAKE_ANCHOR_TOP = -13.5;
const FAKE_ANCHOR_BOTTOM = 0;

export class Door extends Wall {
    private secondSprite: Phaser.Sprite;

    create(game: Phaser.Game,
           group: Phaser.Group,
           hasWallLeft: boolean,
           hasWallTop: boolean,
           hasWallRight: boolean,
           hasWallBottom: boolean
    ) {
        this.game = game;

        if (hasWallLeft) {
            this.sprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.cell).x,
                PositionTransformer.getRealPosition(this.cell).y + FAKE_ANCHOR_TOP,
                'wall',
                18
            );
            this.secondSprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.cell).x,
                PositionTransformer.getRealPosition(this.cell).y + FAKE_ANCHOR_BOTTOM,
                'wall',
                19
            );
        } else {
            this.sprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.cell).x,
                PositionTransformer.getRealPosition(this.cell).y + FAKE_ANCHOR_TOP,
                'wall',
                20
            );
            this.secondSprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.cell).x,
                PositionTransformer.getRealPosition(this.cell).y + FAKE_ANCHOR_BOTTOM,
                'wall',
                21
            );
        }

        this.sprite.anchor.set(0.5, 1 + FAKE_ANCHOR_TOP / this.sprite.height);
        this.secondSprite.anchor.set(0.5, 1 + FAKE_ANCHOR_BOTTOM / this.sprite.height);
        group.add(this.sprite);
        group.add(this.secondSprite);
    }

    setVisibility(visible: boolean) {
        super.setVisibility(visible);
        this.game.add.tween(this.secondSprite).to({
            alpha: visible ? 1 : WALL_ALPHA
        }, 400, 'Linear', true);
    }
}