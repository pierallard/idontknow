import {Cell} from "./Cell";
import {Desk} from "./Desk";
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

        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                this.cells.push(new Cell(new PIXI.Point(x, y)));
            }
        }

        for (let i = 0; i < 3; i++) {
            this.desks.push(new Desk(this.getRandomCell()));
        }
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const floor = groups['floor'];
        const noname = groups['noname'];

        this.cells.forEach((cell: Cell) => {
            cell.create(game, floor);
        });

        this.desks.forEach((desk: Desk) => {
            desk.create(game, noname);
        });

        this.wallRepository.create(game, noname);
    }

    getRandomCell(): PIXI.Point {
        const acceptableIndexes = this.getAcceptables();
        const random = Math.floor(Math.random() * acceptableIndexes.length);

        console.log(this.cells[acceptableIndexes[random]].getPosition());
        return this.cells[acceptableIndexes[random]].getPosition();
    }

    getGrid(): {index: number}[][] {
        let grid = [];
        for (let i = 0; i < this.cells.length; i++) {
            if (undefined === grid[this.cells[i].getPosition().y]) {
                grid[this.cells[i].getPosition().y] = [];
            }
            grid[this.cells[i].getPosition().y][this.cells[i].getPosition().x] = {
                index: i
            };
        }

        return grid;
    }

    getAcceptables(): number[] {
        let acceptables = [];
        for (let i = 0; i < this.cells.length; i++) {
            const x = this.cells[i].getPosition().x;
            const y = this.cells[i].getPosition().y;

            let found = false;
            for (let j = 0; j < this.desks.length; j++) {
                if (this.desks[j].getPosition().x === x && this.desks[j].getPosition().y === y) {
                    found = true;
                }
            }
            if (this.wallRepository.hasWall(x, y)) {
                found = true;
            }
            if (!found) {
                acceptables.push(i);
            }
        }

        return acceptables;
    }

    getWallRepository(): WallRepository {
        return this.wallRepository
    }
}
