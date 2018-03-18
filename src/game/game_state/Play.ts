import {Cell} from "../Cell";
import {Human} from "../Human";
import {PositionTransformer} from "../PositionTransformer";

export default class Play extends Phaser.State {
    private cells: Cell[];
    private human: Human;

    constructor() {
        super();
        this.cells = [];
    }

    public create() {
        this.game.stage.backgroundColor = "#4488AA";

        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 6; y++) {
                this.cells.push(new Cell(this.game, new PIXI.Point(x, y)));
            }
        }

        this.human = new Human(this, this.game, new PIXI.Point(0, 0));
    }

    update() {
        if (this.game.input.activePointer.isDown) {
            const position = PositionTransformer.getCellPosition(this.game.input.activePointer.position);
            this.cells.forEach((cell) => {
                if (cell.getPosition().x === position.x && cell.getPosition().y === position.y) {
                    this.human.moveTo(cell.getPosition());
                    cell.loadTexture('casedefault');
                }
            })
        }
    }

    setHuman(human: Human) {
        this.cells.forEach((cell) => {
            cell.setHuman(human);
        });
    }
}
