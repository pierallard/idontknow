import {GROUP_INTERFACE} from "./game_state/Play";
import {COLOR} from "./Pico8Colors";
import {INTERFACE_WIDTH} from "./user_interface/UserInterface";
import {TEXT_STYLE} from "./TextStyle";
import {CAMERA_WIDTH_PIXELS} from "../app";
import {Employee} from "./human_stuff/Employee";
import {HumanStateManager, STATE} from "./human_stuff/HumanStateManager";

const PARTS = 36;

export class Camembert {
    private graphics: Phaser.Graphics;
    private tooltip: Phaser.Text;
    private game: Phaser.Game;
    private tooltipShowed: boolean;
    private human: Employee;
    private data: CamembertPart[];

    constructor() {
        this.data = [];
        this.tooltipShowed = false;
    }

    create(game:Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.graphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH / 2, 150, groups[GROUP_INTERFACE]);
        this.drawCamembert();
        this.graphics.inputEnabled = true;
        this.graphics.events.onInputOver.add(this.showTooltip, this, 0, game);
        this.graphics.events.onInputOut.add(this.hideTooltip, this, 0, game);

        groups[GROUP_INTERFACE].add(this.graphics);
        this.tooltip = game.add.text(0, 0, '', TEXT_STYLE);
        this.hideTooltip();
    }

    setHuman(human: Employee) {
        this.human = human;
    }

    update() {
        if (this.human) {
            this.refreshData();
            this.drawCamembert();
        }
        if (this.tooltipShowed) {
            const position = this.game.input.mousePointer.position;

            this.tooltip.x = position.x;
            this.tooltip.y = position.y;

            const positionThroughtCenter = new PIXI.Point(
                position.x - this.graphics.x,
                position.y - this.graphics.y
            );
            let angle = Math.atan2(positionThroughtCenter.x, - positionThroughtCenter.y);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            const currentCamembert = this.getSelectedCamembertPart(angle);
            this.tooltip.text = currentCamembert.getString();
        }
    }

    private showTooltip() {
        this.tooltipShowed = true;
        this.tooltip.alpha = 1;
    }

    private hideTooltip() {
        this.tooltipShowed = false;
        this.tooltip.alpha = 0;
    }

    private drawCamembert() {
        this.graphics.clear();

        const sumValues = this.sumValues();
        let currentAngle = 0;
        const RADIUS = (INTERFACE_WIDTH - 30) / 2;

        for (let i = 0; i < this.data.length; i++) {
            const camembertPart = this.data[i];
            const points = camembertPart.getPoints(currentAngle, sumValues, RADIUS);

            currentAngle += camembertPart.getAngle(sumValues);

            this.graphics.beginFill(camembertPart.getColor());
            this.graphics.drawPolygon(points);
            this.graphics.endFill();
        }
    }

    private refreshData() {
        this.data = [];
        this.human.getNextProbabilities().forEach((state) => {
            this.data.push(new CamembertPart(
                state.probability,
                Camembert.getColor(state.state),
                HumanStateManager.getStr(state.state)
            ));
        })
    }

    private static getColor(state: STATE): COLOR {
        switch(state) {
            case STATE.SMOKE: return COLOR.DARK_GREY;
            case STATE.FREEZE: return COLOR.LIGHT_BLUE;
            case STATE.MOVE_RANDOM: return COLOR.ROSE;
            case STATE.SIT: return COLOR.ORANGE;
            case STATE.TYPE: return COLOR.LIGHT_GREEN;
            case STATE.TALK: return COLOR.YELLOW;
            case STATE.COFFEE: return COLOR.MARROON;
            case STATE.RAGE: return COLOR.RED;
            case STATE.SIT_TALK: return COLOR.DARK_GREEN;
        }
    }

    private getSelectedCamembertPart(angle: number): CamembertPart {
        let currentAngle = 0;
        const sum = this.sumValues();
        for (let i = 0; i < this.data.length; i++) {
            const camembertPart = this.data[i];
            const camembertAngle = camembertPart.getAngle(sum);
            if (angle >= currentAngle && angle <= (currentAngle + camembertAngle)) {
                return camembertPart;
            }
            currentAngle += camembertAngle;
        }

        return null;
    }

    private sumValues(): number {
        return this.data.reduce((cur, camembertPart) => {
            return cur + camembertPart.getValue();
        }, 0);
    }

    show() {
        this.graphics.position.x -= INTERFACE_WIDTH;
    }

    hide() {
        this.graphics.position.x += INTERFACE_WIDTH;
    }
}

class CamembertPart {
    private value: number;
    private color: COLOR;
    private text: string;

    constructor(value: number, color: COLOR, text: string) {
        this.value = value;
        this.color = color;
        this.text= text;
    }

    getValue(): number {
        return this.value;
    }

    getPoints(currentAngle: number, sumValues: number, RADIUS: number): PIXI.Point[] {
        const angleOfAPart = Math.PI * 2 / PARTS;
        const littleGap = 10 * Math.PI * 2 / 360;
        const valueAngle = this.getAngle(sumValues);
        let points = [
            new PIXI.Point(Math.sin(currentAngle) * RADIUS, - Math.cos(currentAngle) * RADIUS)
        ];
        for (let j = 0; j < Math.PI * 2; j += angleOfAPart) {
            if (j > currentAngle && j < currentAngle + valueAngle) {
                points.push(new PIXI.Point(
                    Math.sin(j) * RADIUS,
                    - Math.cos(j) * RADIUS
                ));
            }
        }
        points.push(new PIXI.Point(
            Math.sin(Math.min(currentAngle + valueAngle + littleGap, Math.PI * 2)) * RADIUS,
            - Math.cos(Math.min(currentAngle + valueAngle + littleGap, Math.PI * 2)) * RADIUS
        ));
        points.push(new PIXI.Point(0, 0));

        return points;
    }

    getAngle(sumValues: number): number {
        return this.value / sumValues * Math.PI * 2;
    }

    getColor(): COLOR {
        return this.color;
    }

    getString() {
        return this.text;
    }
}
