import {WORLD_HEIGHT, WORLD_WIDTH} from "../app";

export const CELL_WIDTH = 40;
export const CELL_HEIGHT = 20;

export class PositionTransformer {
    static getRealPosition(point: PIXI.Point): PIXI.Point {
        return new PIXI.Point(
            WORLD_WIDTH / 2 - (point.x - point.y) * CELL_WIDTH / 2,
            WORLD_HEIGHT - (point.x + point.y) * CELL_HEIGHT / 2
        );
    }

    static getCellPosition(point: PIXI.Point): PIXI.Point {
        return new PIXI.Point(
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) +
                (point.x - (WORLD_WIDTH / 2)) / (2 * (- CELL_WIDTH / 2))),
            Math.floor(
                (point.y - WORLD_HEIGHT) / (2 * (- CELL_HEIGHT / 2)) -
                (point.x - (WORLD_WIDTH / 2)) / (2 * (- CELL_WIDTH / 2)))
        )
    }

    static dist(position1: PIXI.Point, position2: PIXI.Point): number {
        return (position1.x - position2.x) * (position1.x - position2.x) +
            (position1.y - position2.y) * (position1.y - position2.y);
    }

    static isNeighbor(position1: PIXI.Point, position2: PIXI.Point): boolean {
        return this.dist(position1, position2) === 1;
    }
}