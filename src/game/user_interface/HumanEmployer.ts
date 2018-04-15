import {WorldKnowledge} from "../WorldKnowledge";
import {HumanPropertiesFactory} from "../human_stuff/HumanPropertiesFactory";
import {HumanProperties} from "../human_stuff/HumanProperties";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {OBJECT_SELLER_CELL_SIZE} from "./ObjectSeller";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";

export class HumanEmployer {
    private worldKnowledge: WorldKnowledge;
    private applicantButtons: ApplicantButton[];
    private visible: boolean;
    private game: Phaser.Game;
    private groups: { [index: string]: Phaser.Group };

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.applicantButtons = [];
        this.visible = true;
        for (let i = 0; i < 6; i++) {
            this.applicantButtons.push(new ApplicantButton(this, HumanPropertiesFactory.create(), this.worldKnowledge));
        }
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.game = game;
        this.groups = groups;
        let i = 0;
        this.applicantButtons.forEach((applicant) => {
            applicant.create(game, groups, i);
            i++;
        });
    }

    hide() {
        if (this.visible) {
            this.applicantButtons.forEach((applicantButton) => {
                applicantButton.hide();
            });
        }
        this.visible = false;
    }

    show() {
        if (!this.visible) {
            this.applicantButtons.forEach((applicantButton) => {
                applicantButton.show();
            });
        }
        this.visible = true;
    }

    employ(applicant: ApplicantButton) {
        const index = this.applicantButtons.indexOf(applicant);
        this.applicantButtons[index] = new ApplicantButton(this, HumanPropertiesFactory.create(), this.worldKnowledge);
        this.applicantButtons[index].create(this.game, this.groups, index);
        this.worldKnowledge.addEmployee(applicant.getHumanProperties());
    }
}

class ApplicantButton {
    private humanEmployer: HumanEmployer;
    private humanProperties: HumanProperties;
    private sprite: Phaser.Sprite;
    private name: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private square: Phaser.Graphics;

    constructor(humanEmployer: HumanEmployer, humanProperties: HumanProperties, worldKnowledge: WorldKnowledge) {
        this.humanEmployer = humanEmployer;
        this.humanProperties = humanProperties;
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * OBJECT_SELLER_CELL_SIZE;
        const squareCenter = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            top + OBJECT_SELLER_CELL_SIZE / 2
        );

        this.square = game.add.graphics(left, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, groups[GROUP_INTERFACE]);
        this.square.lineStyle(1, 0xffffff);
        this.square.drawRect(0, 0, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);

        this.sprite = game.add.sprite(squareCenter.x, squareCenter.y, this.humanProperties.getSpriteKey(), 12, groups[GROUP_INTERFACE]);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.inputEnabled = true;
        this.sprite.input.pixelPerfectOver = true;
        this.sprite.input.pixelPerfectClick = true;
        this.sprite.input.useHandCursor = true;
        this.sprite.events.onInputDown.add(this.click, this, 0);

        this.name = game.add.text(left + OBJECT_SELLER_CELL_SIZE + 3, top, this.humanProperties.getName(), TEXT_STYLE, groups[GROUP_INTERFACE]);
    }

    hide() {
        this.sprite.position.x += INTERFACE_WIDTH;
        this.name.position.x += INTERFACE_WIDTH;
        this.square.position.x += INTERFACE_WIDTH + 10;
    }

    show() {
        this.sprite.position.x -= INTERFACE_WIDTH;
        this.name.position.x -= INTERFACE_WIDTH;
        this.square.position.x -= INTERFACE_WIDTH + 10;
    }

    private click() {
        this.sprite.destroy(true);
        this.name.destroy(true);
        this.humanEmployer.employ(this);
        this.square.destroy(true);
    }

    getHumanProperties(): HumanProperties {
        return this.humanProperties;
    }
}