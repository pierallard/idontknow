import {Point} from "../Point";
import {PositionTransformer} from "../PositionTransformer";
import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";

const SPRITES_COUNT = 7;
const FAKE_HEIGHTS = [
    2, 17, 37, 51, 63, 61, 67,
    51, 49, 35, 30, 19, 30, 52
];
const SPRITE_HEIGHT = 108;

export class Stairs {
    private points: PIXI.Point[];
    private startFloor: number;
    private gap: PIXI.Point;
    private frame: number;

    constructor(startFloor: number, points: PIXI.Point[], gap: PIXI.Point, frame: number) {
        this.startFloor = startFloor;
        this.points = points;
        this.gap = gap;
        this.frame = frame;
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }) {
        for (let i = 0; i < SPRITES_COUNT; i++) {
            const frame = this.frame * SPRITES_COUNT + i;
            const fake_height = FAKE_HEIGHTS[frame] - 10;
            const sprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.getStartPoint()).x + this.gap.x,
                PositionTransformer.getRealPosition(this.getStartPoint()).y + this.gap.y - fake_height,
                'stairs2',
                frame,
                groups[GROUP_OBJECTS_AND_HUMANS + this.getStartPoint().z]
            );
            sprite.anchor.setTo(0.5, 1 - fake_height / SPRITE_HEIGHT);
        }
    }

    getStartPoint(): Point {
        return new Point(this.points[0].x, this.points[0].y, this.startFloor);
    }

    getEndPoint(): Point {
        return new Point(
            this.points[this.points.length - 1].x,
            this.points[this.points.length - 1].y,
            this.startFloor + 1
        );
    }

    getStartFloor(): number {
        return this.startFloor;
    }

    getPoints(): Point[] {
        const gap = 1 / this.points.length;
        return this.points.map((point, index) => {
            return new Point(point.x, point.y, this.startFloor + gap * index);
        });
    }
}
