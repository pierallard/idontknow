import {GROUP_INTERFACE} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {Employee} from "../human_stuff/Employee";
import {HumanStateManager, STATE} from "../human_stuff/HumanStateManager";
import {Tooltip, Tooltipable} from "./Tooltip";
import {SmoothValue} from "../SmoothValue";

const PARTS = 36;

export class PieChart implements Tooltipable {
    private graphics: Phaser.Graphics;
    private tooltip: Tooltip;
    private game: Phaser.Game;
    private human: Employee;
    private data: PieChartPart[];
    private shouldRefreshData: boolean;
    private shouldRefreshPieChart: boolean;

    constructor() {
        this.data = [];
        this.tooltip = new Tooltip(() => {
            const position = this.game.input.mousePointer.position;

            const positionThroughtCenter = new PIXI.Point(
                position.x - this.graphics.x,
                position.y - this.graphics.y
            );
            let angle = Math.atan2(positionThroughtCenter.x, - positionThroughtCenter.y);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            const currentPieChart = this.getSelectedPieChartPart(angle);
            if (currentPieChart) {
                return currentPieChart.getString();
            }

            return '';
        });
        this.shouldRefreshData = true;
        this.shouldRefreshPieChart = true;
    }

    create(game:Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.graphics = game.add.graphics(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH / 2, 180, groups[GROUP_INTERFACE]);
        this.drawPieChart();
        this.tooltip.setInput(this, [this.graphics]);

        groups[GROUP_INTERFACE].add(this.graphics);
        this.tooltip.create(game, groups);
    }

    setHuman(human: Employee) {
        this.human = human;
    }

    update() {
        if (this.human) {
            if (this.shouldRefreshData) {
                this.refreshData();
            }
            if (this.shouldRefreshPieChart) {
                this.drawPieChart();
            }
        }
        this.tooltip.update();
    }

    private drawPieChart() {
        this.graphics.clear();

        const sumValues = this.sumValues();
        let currentAngle = 0;
        const RADIUS = (INTERFACE_WIDTH - 30) / 2;

        for (let i = 0; i < this.data.length; i++) {
            const pieChartPart = this.data[i];
            const points = pieChartPart.getPoints(currentAngle, sumValues, RADIUS);

            currentAngle += pieChartPart.getAngle(sumValues);

            this.graphics.beginFill(pieChartPart.getColor());
            this.graphics.drawPolygon(points);
            this.graphics.endFill();
        }

        this.shouldRefreshPieChart = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.1, () => {
            this.shouldRefreshPieChart = true;
        }, this);
    }

    private refreshData() {
        let foundIdentifiers = [];
        const probabilities = this.human.getNextProbabilities();
        Object.keys(probabilities).forEach((key) => {
            const state = <STATE> parseInt(key);
            let found = false;
            for (let i = 0; i < this.data.length; i++) {
                const pieChartPart = this.data[i];
                if (pieChartPart.getState() === state) {
                    pieChartPart.setValue(probabilities[state]);
                    found = true;
                    foundIdentifiers.push(i);
                }
            }
            if (!found) {
                const pieChartPart = new PieChartPart(
                    state,
                    probabilities[state],
                    PieChart.getColor(state),
                    HumanStateManager.getStr(state)
                );
                pieChartPart.create(this.game);
                this.data.push(pieChartPart);
            }
        });
        for (let i = 0; i < this.data.length; i++) {
            if (foundIdentifiers.indexOf(i) <= -1) {
                this.data[i].setValue(0);
            }
        }

        this.shouldRefreshData = false;
        this.game.time.events.add(Phaser.Timer.SECOND * 1.1, () => {
            this.shouldRefreshData = true;
        }, this);
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

    private getSelectedPieChartPart(angle: number): PieChartPart {
        let currentAngle = 0;
        const sum = this.sumValues();
        for (let i = 0; i < this.data.length; i++) {
            const pieChartPart = this.data[i];
            const pieChartAngle = pieChartPart.getAngle(sum);
            if (angle >= currentAngle && angle <= (currentAngle + pieChartAngle)) {
                return pieChartPart;
            }
            currentAngle += pieChartAngle;
        }

        return null;
    }

    private sumValues(): number {
        return this.data.reduce((cur, pieChartPart) => {
            return cur + pieChartPart.getValue();
        }, 0);
    }

    show() {
        this.graphics.position.x -= INTERFACE_WIDTH;
    }

    hide() {
        this.graphics.position.x += INTERFACE_WIDTH;
    }
}

class PieChartPart {
    private state: STATE;
    private value: SmoothValue;
    private color: COLOR;
    private text: string;

    constructor(state: STATE, value: number, color: COLOR, text: string) {
        this.state = state;
        this.value = new SmoothValue(value);
        this.color = color;
        this.text= text;
    }

    create(game: Phaser.Game) {
        this.value.create(game);
    }

    getValue(): number {
        return this.value.getValue();
    }

    getPoints(currentAngle: number, sumValues: number, RADIUS: number): PIXI.Point[] {
        const angleOfAPart = Math.PI * 2 / PARTS;
        const littleGap = 1 * Math.PI * 2 / 360;
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
        return this.value.getValue() / sumValues * Math.PI * 2;
    }

    getColor(): COLOR {
        return this.color;
    }

    getString(): string {
        return this.text;
    }

    getState(): STATE {
        return this.state
    }

    setValue(probability: number) {
        this.value.setValue(probability);
    }
}
