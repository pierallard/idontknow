import {GAME_HEIGHT, GAME_WIDTH} from "../app";

export const CELL_WIDTH = 40;
export const CELL_HEIGHT = 20;

export class PositionTransformer {
    static getRealPosition(point: PIXI.Point): PIXI.Point {
        return new PIXI.Point(
            GAME_WIDTH / 2 - (point.x - point.y) * CELL_WIDTH / 2,
            GAME_HEIGHT - (point.x + point.y) * CELL_HEIGHT / 2
        );
    }

    static getCellPosition(point: PIXI.Point): PIXI.Point {
        const x2 = point.x;
        const y2 = point.y;
        const a = - CELL_WIDTH / 2;
        const c = - CELL_HEIGHT / 2;
        const b = GAME_WIDTH / 2;
        const d = GAME_HEIGHT;
        return new PIXI.Point(
            Math.floor((y2 - d) / (2 * c) + (x2 - b) / (2 * a)),
            Math.floor((y2 - d) / (2 * c) - (x2 - b) / (2 * a))
        )
    }
}