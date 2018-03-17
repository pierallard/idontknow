/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./game/game_state/Boot";
import Preload from "./game/game_state/Preload";
import Play from "./game/game_state/Play";

export const SCALE = 3;
export const GAME_WIDTH = 1600 * 0.8 / SCALE;
export const GAME_HEIGHT = 900 * 0.8 / SCALE;

class SimpleGame extends Phaser.Game {
    constructor() {
        super(
            GAME_WIDTH,
            GAME_HEIGHT,
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

        console.log(this.context);
    }
}

window.onload = () => {
    new SimpleGame();
};
