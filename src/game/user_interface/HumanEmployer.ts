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

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.applicantButtons = [];
        this.visible = true;
        for (let i = 0; i < 3; i++) {
            this.applicantButtons.push(new ApplicantButton(HumanPropertiesFactory.create()));
        }
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        let i = 0;
        this.applicantButtons.forEach((appliant) => {
            appliant.create(game, groups, i);
            i++;
        })
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
}

class ApplicantButton {
    private humanProperties: HumanProperties;
    private sprite: Phaser.Sprite;
    private name: Phaser.Text;

    constructor(humanProperties: HumanProperties) {
        this.humanProperties = humanProperties;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const spriteSource = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            TOP_GAP + (index + 0.5) * OBJECT_SELLER_CELL_SIZE
        );
        this.sprite = game.add.sprite(spriteSource.x, spriteSource.y, this.humanProperties.getSpriteKey(), 12, groups[GROUP_INTERFACE]);
        this.sprite.anchor.set(0.5, 0.5);

        this.name = game.add.text(left + OBJECT_SELLER_CELL_SIZE + 3, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, this.humanProperties.getName(), TEXT_STYLE, groups[GROUP_INTERFACE]);
    }

    hide() {
        this.sprite.position.x += INTERFACE_WIDTH;
        this.name.position.x += INTERFACE_WIDTH;
    }

    show() {
        this.sprite.position.x -= INTERFACE_WIDTH;
        this.name.position.x -= INTERFACE_WIDTH;
    }
}