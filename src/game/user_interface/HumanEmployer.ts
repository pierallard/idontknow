import {WorldKnowledge} from "../WorldKnowledge";
import {EMPLOYEE_TYPE, HumanPropertiesFactory} from "../human_stuff/HumanPropertiesFactory";
import {HumanProperties} from "../human_stuff/HumanProperties";
import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {OBJECT_SELLER_CELL_SIZE} from "./ObjectSeller";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";
import {COLOR} from "../Pico8Colors";
import {Gauge} from "./Gauge";
import {ColoredGauge} from "./ColoredGauge";

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
            this.applicantButtons.push(new ApplicantButton(
                this,
                HumanPropertiesFactory.create(this.getEmployeeTypes()),
                this.worldKnowledge
            ));
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

    update() {
        this.applicantButtons.forEach((applicantButton) => {
            applicantButton.update();
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
        this.cancel(applicant);
        this.worldKnowledge.addEmployee(applicant.getHumanProperties());
    }

    cancel(applicant: ApplicantButton) {
        const index = this.applicantButtons.indexOf(applicant);
        this.applicantButtons[index] = new ApplicantButton(
            this,
            HumanPropertiesFactory.create(this.getEmployeeTypes()),
            this.worldKnowledge
        );
        this.applicantButtons[index].create(this.game, this.groups, index);
        if (!this.visible) {
            this.applicantButtons[index].hide();
        }
    }

    private getEmployeeTypes(): EMPLOYEE_TYPE[] {
        let result: EMPLOYEE_TYPE[] = [EMPLOYEE_TYPE.DEVELOPER];
        if (this.worldKnowledge.getLevel() > 1) {
            result.push(EMPLOYEE_TYPE.SALE);
        }
        if (this.worldKnowledge.getLevel() > 2) {
            result.push(EMPLOYEE_TYPE.MARKETING);
        }
        return result;
    }
}

class ApplicantButton {
    private humanEmployer: HumanEmployer;
    private humanProperties: HumanProperties;
    private sprite: Phaser.Sprite;
    private name: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private square: Phaser.Graphics;
    private typeText: Phaser.Text;
    private availabilityTime: number;
    private remainingTime: number;
    private remainingGauge: Gauge;

    constructor(humanEmployer: HumanEmployer, humanProperties: HumanProperties, worldKnowledge: WorldKnowledge) {
        this.humanEmployer = humanEmployer;
        this.humanProperties = humanProperties;
        this.worldKnowledge = worldKnowledge;
        this.availabilityTime = (45 + Math.random() * 45) * Phaser.Timer.SECOND;
        this.remainingTime = this.availabilityTime;
        this.remainingGauge = new ColoredGauge(OBJECT_SELLER_CELL_SIZE, 5);
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * OBJECT_SELLER_CELL_SIZE;
        const squareCenter = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            top + OBJECT_SELLER_CELL_SIZE / 2
        );

        this.square = game.add.graphics(left, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, groups[GROUP_INTERFACE]);
        this.square.lineStyle(1, COLOR.WHITE);
        this.square.drawRect(0, 0, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);

        this.sprite = game.add.sprite(squareCenter.x, squareCenter.y, this.humanProperties.getSpriteKey(), 12, groups[GROUP_INTERFACE]);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.inputEnabled = true;
        this.sprite.input.pixelPerfectOver = true;
        this.sprite.input.pixelPerfectClick = true;
        this.sprite.input.useHandCursor = true;
        this.sprite.events.onInputDown.add(this.click, this, 0);

        this.name = game.add.text(left + OBJECT_SELLER_CELL_SIZE + 3, top, this.humanProperties.getName(), TEXT_STYLE, groups[GROUP_INTERFACE]);
        this.typeText = game.add.text(left + OBJECT_SELLER_CELL_SIZE + 3, top + 8, this.humanProperties.getStrType(), TEXT_STYLE, groups[GROUP_INTERFACE]);

        this.remainingGauge.create(game, groups, new PIXI.Point(left, top + OBJECT_SELLER_CELL_SIZE - 5 - 0.5));
        this.remainingGauge.setValue(1);
        game.add.tween(this).to({
            remainingTime: 0
        }, this.availabilityTime, 'Linear', true);
    }

    hide() {
        this.sprite.position.x += INTERFACE_WIDTH;
        this.name.position.x += INTERFACE_WIDTH;
        this.typeText.position.x += INTERFACE_WIDTH;
        this.square.position.x += INTERFACE_WIDTH + 10;
        this.remainingGauge.hide();
    }

    show() {
        this.sprite.position.x -= INTERFACE_WIDTH;
        this.name.position.x -= INTERFACE_WIDTH;
        this.typeText.position.x -= INTERFACE_WIDTH;
        this.square.position.x -= INTERFACE_WIDTH + 10;
        this.remainingGauge.show();
    }

    private click() {
        this.destroy();
        this.humanEmployer.employ(this);
    }

    getHumanProperties(): HumanProperties {
        return this.humanProperties;
    }

    update() {
        if (this.remainingTime <= 0) {
            this.destroy();
            this.humanEmployer.cancel(this);
            return;
        }
        this.remainingGauge.setValue(this.remainingTime / this.availabilityTime);
        this.remainingGauge.update();
    }

    private destroy() {
        this.sprite.destroy(true);
        this.name.destroy(true);
        this.typeText.destroy(true);
        this.square.destroy(true);
        this.remainingGauge.destroy(true);
    }
}