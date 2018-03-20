import {PositionTransformer} from "./PositionTransformer";

export class Wall extends Phaser.Sprite {
    private cell: PIXI.Point;

    constructor(
        game: Phaser.Game,
        group: Phaser.Group,
        position: PIXI.Point,
        hasWallLeft: boolean,
        hasWallTop: boolean,
        hasWallRight: boolean,
        hasWallBottom: boolean
    ) {
        super(
            game,
            PositionTransformer.getRealPosition(position).x,
            PositionTransformer.getRealPosition(position).y,
            'wall',
            Wall.getFrame(hasWallLeft, hasWallTop, hasWallRight, hasWallBottom)
        );
        this.cell = position;
        this.anchor.set(0.5, 1);

        console.log(Wall.getFrame(hasWallLeft, hasWallTop, hasWallRight, hasWallBottom));
        // this.loadTexture(this.texture, );

        group.add(this);
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
}
