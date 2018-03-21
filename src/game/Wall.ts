import {PositionTransformer} from "./PositionTransformer";

export class Wall {
    private cell: PIXI.Point;
    private sprite: Phaser.Sprite;
    private game: Phaser.Game;

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
            PositionTransformer.getRealPosition(this.cell).y,
            'wall',
            Wall.getFrame(hasWallLeft, hasWallTop, hasWallRight, hasWallBottom)
        );

        this.sprite.anchor.set(0.5, 1);
        group.add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.cell;
    }

    private static getFrame(hasWallLeft: boolean, hasWallTop: boolean, hasWallRight: boolean, hasWallBottom: boolean): number {
        return (hasWallLeft ? 1 : 0)
            + (hasWallTop ? 1 : 0) * 2
            + (hasWallRight ? 1 : 0) * 4
            + (hasWallBottom ? 1 : 0) * 8;
    }

    setVisibility(visible: boolean) {
        this.game.add.tween(this.sprite).to({
            alpha: visible ? 1 : 0.2
        }, 400, 'Linear', true);
    }
}
