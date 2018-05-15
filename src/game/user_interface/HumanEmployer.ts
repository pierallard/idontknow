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
import {Tooltip, Tooltipable} from "./Tooltip";
import {SMALL_GAP_BETWEEN_LINES} from "./UserInfoPanel";

const STARS = 5;
const MAX_APPLICANTS = 6;

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
        for (let i = 0; i < this.getMaxApplicants(); i++) {
            this.applicantButtons.push(new ApplicantButton(
                this,
                HumanPropertiesFactory.create(this.getEmployeeTypeProbabilities()),
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
        if (this.applicantButtons.length < this.getMaxApplicants()) {
            for (let i = this.applicantButtons.length; i < this.getMaxApplicants(); i++) {
                const newApplicantButton = new ApplicantButton(
                    this,
                    HumanPropertiesFactory.create(this.getEmployeeTypeProbabilities()),
                    this.worldKnowledge
                );
                newApplicantButton.create(this.game, this.groups, i);
                if (!this.visible) {
                    newApplicantButton.hide();
                }
                this.applicantButtons.push(newApplicantButton);
            }
        }
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
            HumanPropertiesFactory.create(this.getEmployeeTypeProbabilities()),
            this.worldKnowledge
        );
        this.applicantButtons[index].create(this.game, this.groups, index);
        if (!this.visible) {
            this.applicantButtons[index].hide();
        }
    }

    private getEmployeeTypeProbabilities(): {[index: number]: number} {
        const result = {};
        result[EMPLOYEE_TYPE.DEVELOPER] = 1;
        if (this.worldKnowledge.getLevel() > 1) {
            result[EMPLOYEE_TYPE.SALE] = 1;
        }
        if (this.worldKnowledge.getLevel() > 2) {
            result[EMPLOYEE_TYPE.MARKETING] = 1;
        }
        return result;
    }

    private getMaxApplicants() {
        if (this.worldKnowledge.getLevel() < 2) {
            return MAX_APPLICANTS / 3;
        }
        if (this.worldKnowledge.getLevel() < 3) {
            return MAX_APPLICANTS * 2 / 3;
        }
        return MAX_APPLICANTS;
    }
}

class ApplicantButton implements Tooltipable {
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
    private stars: Phaser.Sprite[];
    private tooltips: Tooltip[];

    constructor(humanEmployer: HumanEmployer, humanProperties: HumanProperties, worldKnowledge: WorldKnowledge) {
        this.humanEmployer = humanEmployer;
        this.humanProperties = humanProperties;
        this.worldKnowledge = worldKnowledge;
        this.availabilityTime = (45 + Math.random() * 45) * Phaser.Timer.SECOND;
        this.remainingTime = this.availabilityTime;
        this.remainingGauge = new ColoredGauge(OBJECT_SELLER_CELL_SIZE, 5);
        this.stars = [];
        this.tooltips = [];
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
        this.typeText = game.add.text(left + OBJECT_SELLER_CELL_SIZE + 3, top + SMALL_GAP_BETWEEN_LINES, this.humanProperties.getStrType(), TEXT_STYLE, groups[GROUP_INTERFACE]);

        this.remainingGauge.create(game, groups, new PIXI.Point(left, top + OBJECT_SELLER_CELL_SIZE - 5 - 0.5));
        this.remainingGauge.setValue(1);
        game.add.tween(this).to({
            remainingTime: 0
        }, this.availabilityTime, 'Linear', true);

        this.tooltips.push(new Tooltip(() => {
            return 'Wage: ' + this.humanProperties.getRealWage().getStringValue() + '/day';
        }).setInput(this, this.drawStars(game, 'coin', this.humanProperties.getWage(), left + OBJECT_SELLER_CELL_SIZE + 2, top + 18, groups[GROUP_INTERFACE]))
            .create(game, groups));
        this.tooltips.push(new Tooltip(() => {
            return 'Exp: ' + Math.round(this.humanProperties.getExperience() * 100) + '%';
        }).setInput(this, this.drawStars(game, 'star', this.humanProperties.getExperience(), left + OBJECT_SELLER_CELL_SIZE + 55, top + 18, groups[GROUP_INTERFACE]))
            .create(game, groups));
        this.tooltips.push(new Tooltip(() => {
            return 'Speed: ' + Math.round(this.humanProperties.getSpeed() * 100) + '%';
        }).setInput(this, this.drawStars(game, 'star', this.humanProperties.getSpeed(), left + OBJECT_SELLER_CELL_SIZE + 2, top + 28, groups[GROUP_INTERFACE]))
            .create(game, groups));
        this.tooltips.push(new Tooltip(() => {
            return 'Perseverance: ' + Math.round(this.humanProperties.getPerseverance() * 100) + '%';
        }).setInput(this, this.drawStars(game, 'star', this.humanProperties.getPerseverance(), left + OBJECT_SELLER_CELL_SIZE + 55, top + 28, groups[GROUP_INTERFACE]))
            .create(game, groups));
    }

    hide() {
        this.sprite.position.x += INTERFACE_WIDTH;
        this.name.position.x += INTERFACE_WIDTH;
        this.typeText.position.x += INTERFACE_WIDTH;
        this.square.position.x += INTERFACE_WIDTH + 10;
        this.remainingGauge.hide();
        this.stars.forEach((star) => {
            star.position.x += INTERFACE_WIDTH;
        });
    }

    show() {
        this.sprite.position.x -= INTERFACE_WIDTH;
        this.name.position.x -= INTERFACE_WIDTH;
        this.typeText.position.x -= INTERFACE_WIDTH;
        this.square.position.x -= INTERFACE_WIDTH + 10;
        this.remainingGauge.show();
        this.stars.forEach((star) => {
            star.position.x -= INTERFACE_WIDTH;
        });
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
        this.tooltips.forEach((tooltip) => {
            tooltip.update();
        });
        this.remainingGauge.setValue(this.remainingTime / this.availabilityTime);
        this.remainingGauge.update();
    }

    private destroy() {
        this.sprite.destroy(true);
        this.name.destroy(true);
        this.typeText.destroy(true);
        this.square.destroy(true);
        this.remainingGauge.destroy(true);
        this.stars.forEach((star) => {
            star.destroy(true);
        });
        this.tooltips.forEach((tooltip) => {
            tooltip.destroy();
        });
    }

    private drawStars(game: Phaser.Game, key: string, value: number, left: number, top: number, group): Phaser.Sprite[] {
        let stars = [];
        const gap = 1/(STARS * 2 - 1);
        for (let i = 0; i < STARS; i++) {
            let star = null;
            if (value < (i * 2) * gap) {
                star = game.add.sprite(left + i * 8, top, key, 2, group);
            } else if (value < (i * 2 + 1) * gap) {
                star = game.add.sprite(left + i * 8, top, key, 1, group);
            } else {
                star = game.add.sprite(left + i * 8, top, key, 0, group);
            }
            this.stars.push(star);
            stars.push(star);
        }

        return stars;
    }
}
