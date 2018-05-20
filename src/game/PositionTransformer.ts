import {HORIZONTAL_LEFT_SIZE, HORIZONTAL_RIGHT_SIZE, WORLD_HEIGHT, WORLD_WIDTH} from "../app";

export const CELL_WIDTH = 40;
export const CELL_HEIGHT = 20;

export class PositionTransformer {
    static getRealPosition(point: PIXI.Point): PIXI.Point {
        return this.addGap(new PIXI.Point(HORIZONTAL_LEFT_SIZE, WORLD_HEIGHT), point);
    }

    static getCellPosition(point: PIXI.Point): PIXI.Point {
        return new PIXI.Point(
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) +
                (point.x - (HORIZONTAL_LEFT_SIZE)) / (2 * (- CELL_WIDTH / 2))),
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) -
                (point.x - (HORIZONTAL_LEFT_SIZE)) / (2 * (- CELL_WIDTH / 2)))
        )
    }

    static dist(position1: PIXI.Point, position2: PIXI.Point): number {
        return (position1.x - position2.x) * (position1.x - position2.x) +
            (position1.y - position2.y) * (position1.y - position2.y);
    }

    static isNeighbor(position1: PIXI.Point, position2: PIXI.Point): boolean {
        return this.dist(position1, position2) === 1;
    }

    static getCentroid(points: PIXI.Point[]): PIXI.Point {
        return new PIXI.Point(
            points.reduce((sum, point) => { return sum + point.x; }, 0) / points.length,
            points.reduce((sum, point) => { return sum + point.y; }, 0) / points.length
        );
    }

    static addGap(realPosition: PIXI.Point, cellGap: PIXI.Point) {
        return new PIXI.Point(
            realPosition.x - (cellGap.x - cellGap.y) * CELL_WIDTH / 2,
            realPosition.y - (cellGap.x + cellGap.y) * CELL_HEIGHT / 2
        );
    }
}
