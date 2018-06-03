import {HORIZONTAL_LEFT_SIZE, HORIZONTAL_RIGHT_SIZE, WORLD_HEIGHT, WORLD_WIDTH} from "../app";
import {Point} from "./Point";

export const CELL_WIDTH = 40;
export const CELL_HEIGHT = 20;

export class PositionTransformer {
    static getRealPosition(point: Point): PIXI.Point {
        return this.addGap(new PIXI.Point(HORIZONTAL_LEFT_SIZE, WORLD_HEIGHT), point);
    }

    static getCellPosition(point: PIXI.Point): Point {
        // TODO This will not work neither.
        return new Point(
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) +
                (point.x - (HORIZONTAL_LEFT_SIZE)) / (2 * (- CELL_WIDTH / 2))),
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) -
                (point.x - (HORIZONTAL_LEFT_SIZE)) / (2 * (- CELL_WIDTH / 2))),
            0
        )
    }

    static dist(position1: Point, position2: Point): number {
        // TODO This does not take account of stairs.
        return (position1.x - position2.x) * (position1.x - position2.x) +
            (position1.y - position2.y) * (position1.y - position2.y) +
            (position1.z - position2.z) * (position1.z - position2.z);
    }

    static dist2D(position1: PIXI.Point, position2: PIXI.Point) {
        return (position1.x - position2.x) * (position1.x - position2.x) +
            (position1.y - position2.y) * (position1.y - position2.y);
    }

    static is2DNeighbor(position1: PIXI.Point, position2: PIXI.Point): boolean {
        return this.dist2D(position1, position2) === 1;
    }

    static getCentroid(points: Point[]): Point {
        // TODO This does not take account of stairs.
        return new Point(
            points.reduce((sum, point) => { return sum + point.x; }, 0) / points.length,
            points.reduce((sum, point) => { return sum + point.y; }, 0) / points.length,
            points.reduce((sum, point) => { return sum + point.z; }, 0) / points.length
        );
    }

    static addGap(realPosition: PIXI.Point, cellGap: Point) {
        return new PIXI.Point(
            realPosition.x - (cellGap.x - cellGap.y) * CELL_WIDTH / 2,
            realPosition.y - (cellGap.x + cellGap.y) * CELL_HEIGHT / 2 - cellGap.z * 36,
        );
    }

    static isNeighbor(position1: Point, position2: Point) {
        return this.is2DNeighbor(position1.to2DPoint(), position2.to2DPoint()) && position1.z === position2.z;
    }
}
