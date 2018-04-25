import {GROUP_INTERFACE} from "./game_state/Play";
import {COLOR} from "./Pico8Colors";
import {INTERFACE_WIDTH} from "./user_interface/UserInterface";
import {TEXT_STYLE} from "./TextStyle";
import {SCALE} from "../app";

const PARTS = 36;
const RADIUS = INTERFACE_WIDTH / 2;

export class Camembert {
    private graphics: Phaser.Graphics;
    private text: Phaser.Text;
    private values: number[];
    private game: Phaser.Game;
    private showTitle: boolean;

    constructor() {
        this.values = [0.1,0.1,1,2,3,4,5,6];
        this.showTitle = false;
    }

    create(game:Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.graphics = game.add.graphics(RADIUS, RADIUS, groups[GROUP_INTERFACE]);
        this.drawCamembert();
        this.graphics.inputEnabled = true;
        this.graphics.events.onInputOver.add(this.showMachin, this, 0, game);
        this.graphics.events.onInputOut.add(this.hideMachin, this, 0, game);

        this.text = game.add.text(0, 0, 'Foo', TEXT_STYLE);
        this.hideMachin();
    }

    update() {
        if (this.showTitle) {
            const position = this.game.input.mousePointer.position;

            this.text.x = position.x;
            this.text.y = position.y;

            const positionThroughtCenter = new PIXI.Point(
                position.x - this.graphics.x,
                position.y - this.graphics.y
            );
            let angle = Math.atan2(positionThroughtCenter.x, - positionThroughtCenter.y);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            console.log(angle / (2 * Math.PI) * 360);
        }
    }

    private showMachin() {
        this.showTitle = true;
        this.text.alpha = 1;
    }
    private hideMachin() {
        this.showTitle = false;
        this.text.alpha = 0;
    }

    private drawCamembert() {
        const colors = [COLOR.DARK_BLUE, COLOR.RED, COLOR.WHITE, COLOR.LIGHT_GREEN, COLOR.ORANGE, COLOR.SKIN, COLOR.LIGHT_BLUE, COLOR.DARK_PURPLE];

        const sumValues = this.values.reduce((cur, value) => {
            return cur + value;
        }, 0);
        const angleOfAPart = Math.PI * 2 / PARTS;
        const valuesThreshold = [];
        let currentAngle = 0;
        const littleGap = (Math.PI * 2 / 360) * 2;

        for (let i = 0; i < this.values.length; i++) {
            const valueAngle = this.values[i] / sumValues * Math.PI * 2;
            let points = [
                new PIXI.Point(Math.sin(currentAngle) * RADIUS, - Math.cos(currentAngle) * RADIUS)
            ];
            for (let j = 0; j < Math.PI * 2; j += angleOfAPart) {
                if (j < currentAngle) {
                    // Do nothing
                } else if (j > currentAngle + valueAngle) {
                    // Do nothing
                } else {
                    points.push(new PIXI.Point(Math.sin(j) * RADIUS, - Math.cos(j) * RADIUS));
                }
            }
            currentAngle += valueAngle;
            points.push(new PIXI.Point(Math.sin(currentAngle + littleGap) * RADIUS, - Math.cos(currentAngle + littleGap) * RADIUS));
            points.push(new PIXI.Point(0, 0));

            this.graphics.beginFill(colors[i]);
            this.graphics.drawPolygon(points);
            this.graphics.endFill();

            valuesThreshold[i] = currentAngle + valueAngle;
        }
    }
}