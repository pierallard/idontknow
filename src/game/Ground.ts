import {Cell} from "./Cell";
import {Desk} from "./objects/Desk";
import {WallRepository} from "./repositories/WallRepository";
import {Sofa} from "./objects/Sofa";
import {Human} from "./Human";

const WIDTH = 10;
const HEIGHT = 10;

export class Ground {
    private desks: Desk[];
    private cells: Cell[];
    private sofas: Sofa[];
    private wallRepository: WallRepository;

    constructor() {
        this.cells = [];
        this.desks = [];
        this.sofas = [];
        this.wallRepository = new WallRepository();
        [
            new PIXI.Point(3,3),
            new PIXI.Point(3,4),
            new PIXI.Point(2,4),
            new PIXI.Point(2,3),
        ].forEach((cell) => {
            this.wallRepository.addWall(cell);
        });

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                this.cells.push(new Cell(new PIXI.Point(x, y)));
            }
        }

        for (let i = 0; i < 3; i++) {
            this.desks.push(new Desk(this.getRandomCell()));
        }

        for (let i = 0; i < 3; i++) {
            this.sofas.push(new Sofa(this.getRandomCell()));
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

        this.sofas.forEach((sofa: Sofa) => {
            sofa.create(game, noname);
        });

        this.wallRepository.create(game, noname);
    }

    getRandomCell(): PIXI.Point {
        const acceptableIndexes = this.getAcceptables();
        const random = Math.floor(Math.random() * acceptableIndexes.length);

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
            if (this.isFree(this.cells[i].getPosition())) {
                acceptables.push(i);
            }
        }

        return acceptables;
    }

    isFree(point: PIXI.Point): boolean {
        if (point.x < 0 || point.y < 0 || point.x >= WIDTH || point.y >= HEIGHT) {
            return false;
        }

        for (let j = 0; j < this.desks.length; j++) {
            if (this.desks[j].getPosition().x === point.x && this.desks[j].getPosition().y === point.y) {
                return false;
            }
        }

        for (let j = 0; j < this.sofas.length; j++) {
            if (this.sofas[j].getPosition().x === point.x && this.sofas[j].getPosition().y === point.y) {
                return false;
            }
        }

        if (this.wallRepository.hasWall(point.x, point.y)) {
            return false;
        }

        return true;
    }

    getWallRepository(): WallRepository {
        return this.wallRepository
    }

    getRandomFreeSofa(humans: Human[]): Sofa {
        const freeSofas = this.sofas.filter((sofa) => {
            return !this.isSofaTaken(sofa, humans);
        });

        if (freeSofas.length === 0) {
            return null;
        }

        return freeSofas[Math.floor(Math.random() * freeSofas.length)];
    }

    isSofaTaken(sofa: Sofa, humans: Human[]) {
        for (let i = 0; i < humans.length; i++) {
            const human = humans[i];
            if (sofa.getPosition().x === human.getPosition().x && sofa.getPosition().y === human.getPosition().y) {
                return true;
            }
        }

        return false;
    }
}
