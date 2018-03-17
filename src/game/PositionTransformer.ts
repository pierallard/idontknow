import {GAME_HEIGHT, GAME_WIDTH} from "../app";

export const CELL_WIDTH = 40;
export const CELL_HEIGHT = 18;

export class PositionTransformer {
    static getRealPosition(point: PIXI.Point): PIXI.Point {
        return new PIXI.Point(
            GAME_WIDTH / 2 - (point.x - point.y) * CELL_WIDTH / 2,
            GAME_HEIGHT - (point.x + point.y) * CELL_HEIGHT / 2
        );
    }
}