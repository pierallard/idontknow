/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./game/game_state/Boot";
import Preload from "./game/game_state/Preload";
import Play from "./game/game_state/Play";

export const SCALE = 4;
export const CAMERA_WIDTH_PIXELS = 1280 / SCALE;
export const CAMERA_HEIGHT_PIXELS = 720 / SCALE;
export const WORLD_WIDTH = 1280 * 1.1 / 3;
export const WORLD_HEIGHT = 720 * 1.1 / 3;

class SimpleGame extends Phaser.Game {
    constructor() {
        super(
            CAMERA_WIDTH_PIXELS,
            CAMERA_HEIGHT_PIXELS,
            Phaser.CANVAS, // Open GL for effect / shader ?
            'content',
            null,
            false,
            false,
            false,
        );

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
