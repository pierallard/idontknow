import {GROUP_INTERFACE} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";

const BAR_HEIGHT = 10;

export class Gauge {
    private value: number;
    private position: PIXI.Point;
    private width: number;
    private graphics: Phaser.Graphics;
    private color: COLOR;
    private visible: boolean;
    private height: number;

    constructor(position: PIXI.Point, width: number, color: COLOR, height: number = null) {
        this.value = 0;
        this.position = position;
        this.width = Math.round(width);
        this.color = color;
        this.visible = true;
        this.height = height ? height : BAR_HEIGHT;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.graphics = game.add.graphics(this.position.x, this.position.y, groups[GROUP_INTERFACE]);
        this.update();
    }

    setValue(value: number) {
        this.value = value;
        this.update();
    }

    update() {
        this.graphics.clear();
        if (this.visible) {
            this.graphics.lineStyle(0);
            this.graphics.beginFill(this.color);
            this.graphics.drawRect(0, 0.5, Math.floor(this.width * this.value) + 0.5, this.height);
            this.graphics.endFill();
            this.graphics.lineStyle(1, COLOR.WHITE);
            this.graphics.drawRect(0, 0.5, this.width, this.height);
        }
    }

    show() {
        this.visible = true;
        this.update();
    }

    hide() {
        this.visible = false;
        this.update();
    }
}
