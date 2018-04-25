import {GROUP_INTERFACE} from "../game_state/Play";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";
import {ObjectSeller} from "./ObjectSeller";
import {WorldKnowledge} from "../WorldKnowledge";
import {TEXT_STYLE} from "../TextStyle";
import {HumanEmployer} from "./HumanEmployer";
import {InfoPanel} from "./InfoPanel";
import {LevelDisplayer} from "./LevelDisplayer";
import {COLOR} from "../Pico8Colors";

export const INTERFACE_WIDTH = 150.5;
export const TOP_GAP_2 = 15.5 + 12;
export const TOP_GAP = TOP_GAP_2 + 15;

enum PANEL {
    INFO,
    USR,
    OBJ,
}

export class UserInterface {
    private backgroundGraphics: Phaser.Graphics;
    private objectSeller: ObjectSeller;
    private humanEmployer: HumanEmployer;
    private infoPanel: InfoPanel;
    private buttons: Phaser.Text[];
    private selectedPanel: PANEL;
    private levelDisplayer: LevelDisplayer;
    private moneyCounter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.objectSeller = new ObjectSeller(worldKnowledge);
        this.humanEmployer = new HumanEmployer(worldKnowledge);
        this.infoPanel = new InfoPanel(worldKnowledge);
        this.levelDisplayer = new LevelDisplayer(worldKnowledge);
        this.buttons = [];
        this.selectedPanel = PANEL.OBJ;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const interfaceGroup = groups[GROUP_INTERFACE];
        this.backgroundGraphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, 0, interfaceGroup);
        this.backgroundGraphics.beginFill(COLOR.DARK_BLUE);
        this.backgroundGraphics.drawRect(-0.5, 0, INTERFACE_WIDTH, CAMERA_HEIGHT_PIXELS);
        interfaceGroup.add(this.backgroundGraphics);

        this.objectSeller.create(game, groups);
        this.humanEmployer.create(game, groups);
        this.infoPanel.create(game, groups);

        this.levelDisplayer.create(game, groups);

        const buttonWidth = INTERFACE_WIDTH / 3;

        this.moneyCounter = game.add.text(
            CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + 2,
            0,
            this.worldKnowledge.getMoneyInWallet().getStringValue(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );

        let i = 0;
        [['info', PANEL.INFO], ['usr', PANEL.USR], ['obj', PANEL.OBJ]].forEach((panelInfo) => {
            const button = game.add.text(
                CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + i * buttonWidth,
                TOP_GAP_2,
                <string> panelInfo[0],
                TEXT_STYLE,
                interfaceGroup
            );
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
        this.infoPanel.update();
        this.levelDisplayer.update();
        this.moneyCounter.setText(this.worldKnowledge.getMoneyInWallet().getStringValue());
    }

    private selectPanel(panel: PANEL) {
        this.selectedPanel = panel;
        if (this.selectedPanel === PANEL.INFO) {
            this.objectSeller.hide();
            this.humanEmployer.hide();
            this.infoPanel.show();
        } else if (this.selectedPanel === PANEL.USR) {
            this.objectSeller.hide();
            this.humanEmployer.show();
            this.infoPanel.hide();
        } else {
            this.objectSeller.show();
            this.humanEmployer.hide();
            this.infoPanel.hide();
        }
    }
}
