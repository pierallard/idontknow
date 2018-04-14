import {GROUP_INTERFACE} from "../game_state/Play";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";
import {OBJECT_SELLER_CELL_SIZE, ObjectSeller} from "./ObjectSeller";
import {WorldKnowledge} from "../WorldKnowledge";
import {TEXT_STYLE} from "../TextStyle";
import {HumanEmployer} from "./HumanEmployer";

export const INTERFACE_WIDTH = 150;
export const TOP_GAP = 15;
enum PANEL {
    INFO,
    USR,
    OBJ,
}

export class UserInterface {
    private backgroundGraphics: Phaser.Graphics;
    private objectSeller: ObjectSeller;
    private humanEmployer: HumanEmployer;
    private buttons: Phaser.Text[];
    private selectedPanel: PANEL;

    constructor(worldKnowledge: WorldKnowledge) {
        this.objectSeller = new ObjectSeller(worldKnowledge);
        this.humanEmployer = new HumanEmployer(worldKnowledge);
        this.buttons = [];
        this.selectedPanel = PANEL.OBJ;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const interfaceGroup = groups[GROUP_INTERFACE];
        this.backgroundGraphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, 0, interfaceGroup);
        this.backgroundGraphics.beginFill(0x272a60);
        this.backgroundGraphics.drawRect(0, 0, INTERFACE_WIDTH, CAMERA_HEIGHT_PIXELS);
        interfaceGroup.add(this.backgroundGraphics);

        for (let i = 0; i < 10; i++) {
            this.backgroundGraphics.endFill();
            this.backgroundGraphics.lineStyle(1, 0xffffff);
            this.backgroundGraphics.drawRect(0, TOP_GAP + i * OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);
        }

        this.objectSeller.create(game, groups);
        this.humanEmployer.create(game, groups);

        const buttonWidth = INTERFACE_WIDTH / 3;

        let i = 0;
        [['info', PANEL.INFO], ['usr', PANEL.USR], ['obj', PANEL.OBJ]].forEach((panelInfo) => {
            const button = game.add.text(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + i * buttonWidth, 0, <string> panelInfo[0], TEXT_STYLE, interfaceGroup);
            button.inputEnabled = true;
            button.input.useHandCursor = true;
            button.events.onInputDown.add(() => {
                this.selectPanel(<PANEL> panelInfo[1]);
            });
            this.buttons.push(button);
            i++;
        });

        this.selectPanel(PANEL.INFO);
    }

    update() {
        this.objectSeller.update();
    }

    private selectPanel(panel: PANEL) {
        this.selectedPanel = panel;
        if (this.selectedPanel === PANEL.INFO) {
            this.objectSeller.hide();
            this.humanEmployer.hide();
        } else if (this.selectedPanel === PANEL.USR) {
            this.objectSeller.hide();
            this.humanEmployer.show();
        } else {
            this.objectSeller.show();
            this.humanEmployer.hide();
        }
    }
}
