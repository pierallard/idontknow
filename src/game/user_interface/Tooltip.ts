import {TEXT_STYLE} from "../TextStyle";
import {GROUP_INTERFACE} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {SCALE} from "../../app";

export class Tooltip {
    private game: Phaser.Game;
    private box: Phaser.Graphics;
    private text: Phaser.Text;
    private cursorPosition: PIXI.Point;

    create(game:Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.box = game.add.graphics(0, 0, groups[GROUP_INTERFACE]);
        this.text = game.add.text(0, 0, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
    }

    update() {
        this.cursorPosition = new PIXI.Point(
            SCALE * Math.round(this.game.input.mousePointer.position.x / SCALE) + 0.5,
            SCALE * Math.round(this.game.input.mousePointer.position.y / SCALE) + 0.5
        );
        this.text.x = this.cursorPosition.x + 6;
        this.text.y = this.cursorPosition.y + 12;
        this.updateBox();
    }

    setText(text: string) {
        this.text.text = text;
        this.updateBox();
    }

    show() {
        this.text.alpha = 1;
        this.box.alpha = 1;
    }

    hide() {
        this.text.alpha = 0;
        this.box.alpha = 0;
        this.box.clear();
    }

    private updateBox() {
        this.box.clear();
        this.box.beginFill(COLOR.BLACK);
        this.box.lineStyle(1, COLOR.WHITE);
        this.box.drawRect(
            this.cursorPosition.x + 4,
            this.cursorPosition.y + 13,
            this.text.width + 1,
            8
        );
    }
}
