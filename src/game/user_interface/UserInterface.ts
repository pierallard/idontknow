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
import {DAY_DURATION} from "../human_stuff/HumanProperties";

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
    private buttons: InterfaceTab[];
    private selectedPanel: PANEL;
    private levelDisplayer: LevelDisplayer;
    private moneyCounter: Phaser.Text;
    private levelText: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private userInfoPanel: UserInfoPanel;
    private dayText: Phaser.Text
    private day: number;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.objectSeller = new ObjectSeller(worldKnowledge);
        this.humanEmployer = new HumanEmployer(worldKnowledge);
        this.infoPanel = new InfoPanel(worldKnowledge);
        this.userInfoPanel = new UserInfoPanel(worldKnowledge);
        this.levelDisplayer = new LevelDisplayer(worldKnowledge);
        this.buttons = [];
        let i = 0;
        [['info', PANEL.INFO], ['usr', PANEL.USR], ['obj', PANEL.OBJ]].forEach((panelInfo) => {
            this.buttons.push(new InterfaceTab(
                this, i, <string> panelInfo[0], <PANEL> panelInfo[1]
            ));
            i++;
        });
        this.selectedPanel = PANEL.OBJ;
        this.day = 1;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const interfaceGroup = groups[GROUP_INTERFACE];
        this.backgroundGraphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, 0, interfaceGroup);
        this.backgroundGraphics.beginFill(COLOR.BLACK);
        this.backgroundGraphics.drawRect(-0.5, 0, INTERFACE_WIDTH + 0.5, TOP_GAP_2);
        this.backgroundGraphics.beginFill(COLOR.DARK_BLUE);
        this.backgroundGraphics.drawRect(-0.5, TOP_GAP_2, INTERFACE_WIDTH + 0.5, CAMERA_HEIGHT_PIXELS - TOP_GAP_2);
        interfaceGroup.add(this.backgroundGraphics);

        this.objectSeller.create(game, groups);
        this.humanEmployer.create(game, groups);
        this.infoPanel.create(game, groups);
        this.userInfoPanel.create(game, groups);

        this.levelDisplayer.create(game, groups);
        this.dayText = game.add.text(
            CAMERA_WIDTH_PIXELS - 50,
            0,
            'Day 1',
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );
        game.time.events.loop(DAY_DURATION, () => {
            this.day += 1;
            this.updateDayText();
        }, this);

        this.levelText = game.add.text(
            CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + 2,
            0,
            'Lvl 1',
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );

        this.moneyCounter = game.add.text(
            CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + 2 + 50,
            0,
            this.worldKnowledge.getMoneyInWallet().getStringValue(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );

        const backgroundTabs = game.add.sprite(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH, TOP_GAP_2, 'interfacetabs', 2, groups[GROUP_INTERFACE]);
        backgroundTabs.scale.set(10, 1);

        this.buttons.forEach((button) => {
            button.create(game, groups);
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
        this.levelText.setText('Lvl ' + this.worldKnowledge.getLevel());
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
            this.highlightButton(PANEL.INFO);
        } else if (this.selectedPanel === PANEL.USR) {
            this.objectSeller.hide();
            this.humanEmployer.show();
            this.infoPanel.hide();
            this.userInfoPanel.hide();
            this.worldKnowledge.unselectHuman(false);
            this.highlightButton(PANEL.USR);
        } else if (this.selectedPanel === PANEL.OBJ) {
            this.objectSeller.show();
            this.humanEmployer.hide();
            this.infoPanel.hide();
            this.userInfoPanel.hide();
            this.worldKnowledge.unselectHuman(false);
            this.highlightButton(PANEL.OBJ);
        } else if (this.selectedPanel === PANEL.USER_INFO) {
            this.objectSeller.hide();
            this.humanEmployer.hide();
            this.infoPanel.hide();
            this.userInfoPanel.show();
            this.highlightButton(PANEL.INFO);
        }
    }

    setSelectedHuman(param: Employee) {
        this.selectPanel(PANEL.USER_INFO);
        this.userInfoPanel.showEmployeeInfoPanelForYohan(param);
    }

    private highlightButton(panel: PANEL) {
        this.buttons.forEach((button) => {
            button.highlight(button.getPanel() === panel);
        })
    }

    private updateDayText() {
        this.dayText.text = 'Day ' + this.day;
    }
}

class InterfaceTab {
    private userInterface: UserInterface;
    private text: string;
    private panel: PANEL;
    private position: PIXI.Point;
    private buttonText: Phaser.Text;
    private buttonSprite: Phaser.Sprite;

    constructor(userInterface: UserInterface, i: number, text: string, panel: PANEL) {
        this.position = new PIXI.Point(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + i * (28 + 5), TOP_GAP_2);
        this.text = text;
        this.panel = panel;
        this.userInterface = userInterface;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.buttonSprite = game.add.sprite(this.position.x, this.position.y, 'interfacetabs', 0, groups[GROUP_INTERFACE]);
        this.buttonText = game.add.text(
            this.position.x + 4,
            this.position.y,
            this.text,
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );

        this.buttonSprite.inputEnabled = true;
        this.buttonSprite.input.useHandCursor = true;
        this.buttonSprite.events.onInputDown.add(() => {
            this.userInterface.selectPanel(this.panel);
        });
    }

    getPanel(): PANEL {
        return this.panel
    }

    highlight(value: boolean) {
        this.buttonSprite.loadTexture('interfacetabs', value ? 1 : 0);
    }
}