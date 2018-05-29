import {PositionTransformer} from "../PositionTransformer";
import {Point} from "../Point";

const FAKE_ANCHOR = -4;
const RADIUS_INVISIBLE = 10;
const RADIUS_VISIBLE = 50;
const MIN_ALPHA = 0.5;

export class Wall {
    protected cell: Point;
    protected sprite: Phaser.Sprite;
    protected game: Phaser.Game;

    constructor(position: Point) {
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

    getPosition(): Point {
        return this.cell;
    }

    update() {
        const mousePosition = this.game.input.mousePointer.position;
        const position = new PIXI.Point(
            mousePosition.x + this.game.camera.x - this.sprite.position.x,
            mousePosition.y + 20 + this.game.camera.y - this.sprite.position.y
        );

        const radius = Math.sqrt(position.x * position.x + position.y * position.y);
        if (radius < RADIUS_INVISIBLE) {
            this.setVisibility(MIN_ALPHA);
        } else if (radius > RADIUS_VISIBLE) {
            this.setVisibility(1);
        } else {
            const a = (MIN_ALPHA - 1) / (RADIUS_INVISIBLE - RADIUS_VISIBLE);
            const b = 1 - a * RADIUS_VISIBLE;
            this.setVisibility(a * radius + b);
        }
    }

    protected setVisibility(value: number) {
        this.sprite.alpha = value;
    }

    protected static getFrame(hasWallLeft: boolean, hasWallTop: boolean, hasWallRight: boolean, hasWallBottom: boolean): number {
        return (hasWallLeft ? 1 : 0)
            + (hasWallTop ? 1 : 0) * 2
            + (hasWallRight ? 1 : 0) * 4
            + (hasWallBottom ? 1 : 0) * 8;
    }
}
