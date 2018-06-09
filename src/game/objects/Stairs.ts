import {Point} from "../Point";
import {PositionTransformer} from "../PositionTransformer";
import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";

export class Stairs {
    private points: PIXI.Point[];
    private startFloor: number;
    private sprite: Phaser.Sprite;
    private gap: PIXI.Point;
    private frame: number;

    constructor(startFloor: number, points: PIXI.Point[], gap: PIXI.Point, frame: number) {
        this.startFloor = startFloor;
        this.points = points;
        this.gap = gap;
        this.frame = frame;
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.getStartPoint()).x + this.gap.x,
            PositionTransformer.getRealPosition(this.getStartPoint()).y + this.gap.y,
            'stairs',
            this.frame,
            groups[GROUP_OBJECTS_AND_HUMANS + this.getStartPoint().z]
        );
        this.sprite.anchor.setTo(0.5, 1);
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
