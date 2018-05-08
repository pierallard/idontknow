/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./game/game_state/Boot";
import Preload from "./game/game_state/Preload";
import Play from "./game/game_state/Play";
import {CELL_HEIGHT, CELL_WIDTH} from "./game/PositionTransformer";
import {GRID_HEIGHT, GRID_WIDTH} from "./game/WorldKnowledge";

export const SCALE = 2;
const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT= 650;
export const CAMERA_WIDTH_PIXELS = CANVAS_WIDTH / SCALE;
export const CAMERA_HEIGHT_PIXELS = CANVAS_HEIGHT / SCALE;
export const WORLD_WIDTH = GRID_WIDTH * CELL_WIDTH / 2 + GRID_HEIGHT * CELL_WIDTH / 2;
export const WORLD_HEIGHT = GRID_WIDTH * CELL_HEIGHT / 2 + GRID_HEIGHT * CELL_HEIGHT / 2 + 15;

class SimpleGame extends Phaser.Game {
    constructor() {
        super({
            width: CAMERA_WIDTH_PIXELS,
            height: CAMERA_HEIGHT_PIXELS,
            renderer: Phaser.CANVAS,
            parent: null,
            state: 'content',
            transparent: false,
            antialias: false,
            physicsConfig: false,
            forceSetTimeOut: true,
        });

        this.antialias = false;
        this.state.add('Boot', Boot);
        this.state.add('Preload', Preload);
        this.state.add('Play', Play);
        this.state.start('Boot');
    }
}

window.onload = () => {
    new SimpleGame();
};
