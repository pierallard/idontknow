import {Cell} from "./Cell";
import {Desk} from "./Desk";

export class Ground {
    private desks: Desk[];
    private cells: Cell[];

    constructor(game: Phaser.Game, floor: Phaser.Group, group: Phaser.Group) {
        this.cells = [];
        this.desks = [];
        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 6; y++) {
                this.cells.push(new Cell(game, floor, new PIXI.Point(x, y)));
            }
        }
        for (let i = 0; i < 3; i++) {
            this.desks.push(new Desk(game, group, new PIXI.Point(Math.floor(Phaser.Math.random(0, 6)), Math.floor(Phaser.Math.random(0, 6)))))
        }
    }

    getGrid(): {index: number}[][] {
        let grid = [];
        for (let y = 0; y < 6; y++) {
            grid[y] = [];
            for (let x = 0; x < 6; x++) {
                grid[y][x] = {
                    index: y * 6 + x
                };
            }
        }

        return grid;
    }

    getAcceptables(): number[] {
        let acceptables = [];
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                let found = false;
                for (let i = 0; i < this.desks.length; i++) {
                    if (this.desks[i].getPosition().x === x && this.desks[i].getPosition().y === y) {
                        found = true
                    }
                }
                if (!found) {
                    acceptables.push(y * 6 + x);
                }
            }
        }

        return acceptables;
    }
}
