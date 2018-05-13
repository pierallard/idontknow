import {PositionTransformer} from "../PositionTransformer";

const FAKE_ANCHOR = -4;
export const WALL_ALPHA = 1;

export class Wall {
    protected cell: PIXI.Point;
    protected sprite: Phaser.Sprite;
    protected game: Phaser.Game;

    constructor(position: PIXI.Point) {
        this.cell = position;
    }

    create(
        game: Phaser.Game,
        group: Phaser.Group,
        hasWallLeft: boolean,
        hasWallTop: boolean,
        hasWallRight: boolean,
        hasWallBottom: boolean
    ) {
        this.game = game;
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.cell).x,
            PositionTransformer.getRealPosition(this.cell).y + FAKE_ANCHOR,
            'wall',
            Wall.getFrame(hasWallLeft, hasWallTop, hasWallRight, hasWallBottom)
        );

        this.sprite.anchor.set(0.5, 1 + FAKE_ANCHOR / this.sprite.height);
        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.cell;
    }

    protected static getFrame(hasWallLeft: boolean, hasWallTop: boolean, hasWallRight: boolean, hasWallBottom: boolean): number {
        return (hasWallLeft ? 1 : 0)
            + (hasWallTop ? 1 : 0) * 2
            + (hasWallRight ? 1 : 0) * 4
            + (hasWallBottom ? 1 : 0) * 8;
    }

    setVisibility(visible: boolean) {
        this.game.add.tween(this.sprite).to({
            alpha: visible ? 1 : WALL_ALPHA
        }, 400, 'Linear', true);
    }
}
