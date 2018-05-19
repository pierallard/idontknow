import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";
import {MEDIUM_GAP_BETWEEN_LINES} from "./UserInfoPanel";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";
import {COLOR} from "../Pico8Colors";

const LETTER_WIDTH = 6.5;
const LETTER_HEIGHT = MEDIUM_GAP_BETWEEN_LINES;

export class InfoBox {
    private title: string;
    private textLines: string[];
    private buttonText: string;
    private elements: any;
    private escapeKey: Phaser.Key;
    private visible: boolean;

    constructor(
        title: string,
        textLines: string[],
        buttonText: string
    ) {
        this.title = title;
        this.textLines = textLines;
        this.buttonText = buttonText;
        this.elements = [];
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.escapeKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.visible = true;

        const closableElements = [];
        const internalWidth = this.getMaxLength() * LETTER_WIDTH;
        const internalHeight = LETTER_HEIGHT * this.textLines.length + 12 + 12;
        const width = internalWidth + 9 + 9;
        const height = internalHeight + 12 + 12;
        const left = (CAMERA_WIDTH_PIXELS - width) / 2;
        const top = (CAMERA_HEIGHT_PIXELS - height) / 2;

        const graphics = game.add.graphics(0, 0, groups[GROUP_INTERFACE]);
        graphics.beginFill(COLOR.BLACK, 0.7);
        graphics.drawRect(0, 0, CAMERA_WIDTH_PIXELS, CAMERA_HEIGHT_PIXELS);
        this.elements.push(graphics);

        this.elements.push(game.add.sprite(left, top, 'info', 0, groups[GROUP_INTERFACE]));
        const topBar = game.add.sprite(left + 12, top, 'info', 1, groups[GROUP_INTERFACE]);
        topBar.scale.set(internalWidth / 12, 1);
        this.elements.push(topBar);
        const close = game.add.sprite(left + 12 + internalWidth, top, 'info', 2, groups[GROUP_INTERFACE]);
        closableElements.push(close);
        this.elements.push(close);

        const leftSprite = game.add.sprite(left, top + 12, 'info', 3, groups[GROUP_INTERFACE]);
        this.elements.push(leftSprite);
        leftSprite.scale.set(1, internalHeight / 12);
        const center = game.add.sprite(left + 12, top + 12, 'info', 4, groups[GROUP_INTERFACE]);
        this.elements.push(center);
        center.scale.set((internalWidth + 1) / 12, internalHeight / 12);
        const right = game.add.sprite(left + 12 + internalWidth, top + 12, 'info', 5, groups[GROUP_INTERFACE]);
        right.scale.set(1, internalHeight / 12);
        this.elements.push(right);

        this.elements.push(game.add.sprite(left, top + 12 + internalHeight, 'info', 6, groups[GROUP_INTERFACE]));
        const bottom = game.add.sprite(left + 12, top + 12 + internalHeight, 'info', 7, groups[GROUP_INTERFACE]);
        bottom.scale.set(internalWidth / 12, 1);
        this.elements.push(bottom);
        this.elements.push(game.add.sprite(left + 12 + internalWidth, top + 12 + internalHeight, 'info', 8, groups[GROUP_INTERFACE]));

        const buttonWidth = this.buttonText.length * LETTER_WIDTH - 12;
        const buttonLeft = left + width - 12 - 8 - buttonWidth - 8;
        const buttonTop = top + height - 12 - 12;
        const buttonLeftSprite = game.add.sprite(buttonLeft, buttonTop, 'info', 9, groups[GROUP_INTERFACE]);
        closableElements.push(buttonLeftSprite);
        this.elements.push(buttonLeftSprite);
        const buttonCenter = game.add.sprite(buttonLeft + 12, buttonTop, 'info', 10, groups[GROUP_INTERFACE]);
        closableElements.push(buttonCenter);
        buttonCenter.scale.set((buttonWidth + 1) / 12, 1);
        this.elements.push(buttonCenter);
        const buttonRightSprite = game.add.sprite(buttonLeft + 12 + buttonWidth, buttonTop, 'info', 11, groups[GROUP_INTERFACE]);
        closableElements.push(buttonRightSprite);
        this.elements.push(buttonRightSprite);

        this.elements.push(game.add.text(left + 8, top, this.title, TEXT_STYLE, groups[GROUP_INTERFACE]));
        this.textLines.forEach((str, i) => {
            this.elements.push(game.add.text(left + 9, top + 6 + 12 + i * LETTER_HEIGHT, str, TEXT_STYLE, groups[GROUP_INTERFACE]));
        });
        this.elements.push(game.add.text(buttonLeft + 9, buttonTop, this.buttonText, TEXT_STYLE, groups[GROUP_INTERFACE]));

        closableElements.forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.close, this);
        })
    }

    update() {
        if (this.escapeKey.isDown) {
            this.close();
        }
    }

    private close() {
        this.visible = false;
        this.elements.forEach((element) => {
            element.destroy(true);
        });
    };

    private getMaxLength() {
        return this.textLines.concat(this.title).concat(this.buttonText).reduce((prev, str) => {
            return Math.max(prev, str.length);
        }, 0);
    }

    isVisible(): boolean {
        return this.visible;
    }
}