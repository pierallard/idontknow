import {GROUP_INTERFACE} from "../game_state/Play";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS} from "../../app";
import {ObjectSeller} from "./ObjectSeller";
import {WorldKnowledge} from "../WorldKnowledge";
import {TEXT_STYLE} from "../TextStyle";
import {HumanEmployer} from "./HumanEmployer";
import {InfoPanel} from "./InfoPanel";
import {LevelDisplayer} from "./LevelDisplayer";
import {Employee} from "../human_stuff/Employee";
import {UserInfoPanel} from "./UserInfoPanel";
import {COLOR} from "../Pico8Colors";

export const INTERFACE_WIDTH = 150.5;
export const TOP_GAP_2 = 15.5 + 12;
export const TOP_GAP = TOP_GAP_2 + 15;

export enum PANEL {
    INFO,
    USR,
    OBJ,
    USER_INFO,
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
    private userInfoPanel: UserInfoPanel;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.objectSeller = new ObjectSeller(worldKnowledge);
        this.humanEmployer = new HumanEmployer(worldKnowledge);
        this.infoPanel = new InfoPanel(worldKnowledge);
        this.userInfoPanel = new UserInfoPanel(worldKnowledge);
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
        this.userInfoPanel.create(game, groups);

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
        this.userInfoPanel.update();
        this.humanEmployer.update();
        this.moneyCounter.setText(this.worldKnowledge.getMoneyInWallet().getStringValue());
    }

    selectPanel(panel: PANEL) {
        if (this.selectedPanel === panel) {
            return;
        }
        this.selectedPanel = panel;
        if (this.selectedPanel === PANEL.INFO) {
            this.objectSeller.hide();
            this.humanEmployer.hide();
            this.infoPanel.show();
            this.userInfoPanel.hide();
            this.worldKnowledge.unselectHuman(false);
        } else if (this.selectedPanel === PANEL.USR) {
            this.objectSeller.hide();
            this.humanEmployer.show();
            this.infoPanel.hide();
            this.userInfoPanel.hide();
            this.worldKnowledge.unselectHuman(false);
        } else if (this.selectedPanel === PANEL.OBJ) {
            this.objectSeller.show();
            this.humanEmployer.hide();
            this.infoPanel.hide();
            this.userInfoPanel.hide();
            this.worldKnowledge.unselectHuman(false);
        } else if (this.selectedPanel === PANEL.USER_INFO) {
            this.objectSeller.hide();
            this.humanEmployer.hide();
            this.infoPanel.hide();
            this.userInfoPanel.show();
        }
    }

    setSelectedHuman(param: Employee) {
        this.selectPanel(PANEL.USER_INFO);
        this.userInfoPanel.showEmployeeInfoPanelForYohan(param);
    }
}
