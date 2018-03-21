import {Cell} from "./Cell";
import {Desk} from "./Desk";
import {Wall} from "./Wall";
import {WallRepository} from "./repositories/WallRepository";

export class Ground {
    private desks: Desk[];
    private cells: Cell[];
    private wallRepository: WallRepository;

    constructor() {
        this.cells = [];
        this.desks = [];
        this.wallRepository = new WallRepository();

        [
            new PIXI.Point(3,3),
            new PIXI.Point(3,4),
            new PIXI.Point(2,4),
            new PIXI.Point(2,3),
        ].forEach((cell) => {
            this.wallRepository.addWall(cell);
        });
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const floor = groups['floor'];
        const noname = groups['noname'];

        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 6; y++) {
                this.cells.push(new Cell(game, floor, new PIXI.Point(x, y)));
            }
        }

        for (let i = 0; i < 3; i++) {
            this.desks.push(new Desk(game, noname, new PIXI.Point(Math.floor(Phaser.Math.random(0, 6)), Math.floor(Phaser.Math.random(0, 6)))))
        }

        this.wallRepository.create(game, noname);
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
                        found = true;
                    }
                }
                if (this.wallRepository.hasWall(x, y)) {
                    found = true;
                }
                if (!found) {
                    acceptables.push(y * 6 + x);
                }
            }
        }

        return acceptables;
    }
}
