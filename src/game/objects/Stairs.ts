import {Point} from "../Point";

export class Stairs {
    private points: PIXI.Point[];
    private startFloor: number;

    constructor(startFloor: number, points: PIXI.Point[]) {
        this.startFloor = startFloor;
        this.points = points;
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
        return this.points.map((point) => {
            return new Point(point.x, point.y, this.startFloor);
        });
    }
}
