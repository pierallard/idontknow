import {TEXT_STYLE} from "../TextStyle";
import {GROUP_TOOLTIP} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {CAMERA_WIDTH_PIXELS, SCALE} from "../../app";

export interface Tooltipable {
}

export class Tooltip {
    private game: Phaser.Game;
    private box: Phaser.Graphics;
    private text: Phaser.Text;
    private cursorPosition: PIXI.Point;
    private tooltipable: Tooltipable;
    private getValueFunction: Function;

    constructor(getValueFunction: Function) {
        this.getValueFunction = getValueFunction;
    }

    create(game:Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.box = game.add.graphics(0, 0, groups[GROUP_TOOLTIP]);
        this.text = game.add.text(0, 0, '', TEXT_STYLE, groups[GROUP_TOOLTIP]);
        this.hide();
    }

    update() {
        if (this.text.alpha > 0) {
            this.text.text = this.getValueFunction.call(this.tooltipable);
            this.text.x = this.getTooltipPosition().x;
            this.text.y = this.getTooltipPosition().y;
            this.updateBox();
        }
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
            this.getTooltipPosition().x - 2,
            this.getTooltipPosition().y + 1,
            this.getBoxWidth(),
            8
        );
    }

    setInput(tooltipable: Tooltipable, graphics: Phaser.Graphics) {
        graphics.inputEnabled = true;
        graphics.events.onInputOver.add(this.show, this, 0);
        graphics.events.onInputOut.add(this.hide, this, 0);
        this.tooltipable = tooltipable;
    }

    private getTooltipPosition() {
        this.cursorPosition = new PIXI.Point(
            SCALE * Math.round(this.game.input.mousePointer.position.x / SCALE) + 0.5,
            SCALE * Math.round(this.game.input.mousePointer.position.y / SCALE) + 0.5
        );
        let position = new PIXI.Point(
            this.cursorPosition.x + 6,
            this.cursorPosition.y + 9
        );
        if (position.x + this.getBoxWidth() > CAMERA_WIDTH_PIXELS) {
            position.x = CAMERA_WIDTH_PIXELS - this.getBoxWidth() + 0.5;
        }
        return position;
    }

    private getBoxWidth() {
        return this.text.width + 1
    }
}
