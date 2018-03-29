import {Cell} from "./Cell";
import {Desk} from "./objects/Desk";
import {WallRepository} from "./repositories/WallRepository";
import {Sofa} from "./objects/Sofa";
import {Human} from "./human_stuff/Human";
import {SittableInterface} from "./objects/SittableInterface";
import {World} from "./World";
import {ObjectInterface} from "./objects/ObjectInterface";

const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;

export const DEBUG_WORLD = false;

export class Ground {
    private desks: Desk[];
    private cells: Cell[];
    private sofas: Sofa[];
    private wallRepository: WallRepository;

    constructor(world: World) {
        this.cells = [];
        this.desks = [];
        this.sofas = [];
        this.wallRepository = new WallRepository();

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.cells.push(new Cell(new PIXI.Point(x, y)));
            }
        }

        if (DEBUG_WORLD) {
            this.wallRepository.addWall(new PIXI.Point(5, 5));
            this.wallRepository.addWall(new PIXI.Point(6, 5));
            this.desks.push(new Desk(new PIXI.Point(4, 5), world));
            return;
        }

        for (let x = 0; x < GRID_WIDTH; x++) {
            this.wallRepository.addWall(new PIXI.Point(x, 0));
            this.wallRepository.addWall(new PIXI.Point(x, GRID_HEIGHT - 1));
        }
        for (let y = 1; y < (GRID_HEIGHT - 1); y++) {
            this.wallRepository.addWall(new PIXI.Point(0, y));
            this.wallRepository.addWall(new PIXI.Point(GRID_WIDTH - 1, y));
        }
        for (let x = 1; x < 3 - 1; x++) {
            this.wallRepository.addWall(new PIXI.Point(x, GRID_WIDTH / 2 + 1));
        }
        for (let x = 5; x < GRID_WIDTH - 1; x++) {
            this.wallRepository.addWall(new PIXI.Point(x, GRID_WIDTH / 2 + 1));
        }
        [
            new PIXI.Point(4,3),
            new PIXI.Point(4,4),
            new PIXI.Point(3,4),
            new PIXI.Point(3,3),
        ].forEach((cell) => {
            this.wallRepository.addWall(cell);
        });

        for (let i = 0; i < 3; i++) {
            this.desks.push(new Desk(this.getRandomCell(), world));
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

    isFree(point: PIXI.Point, object: ObjectInterface = null): boolean {
        if (point.x < 0 || point.y < 0 || point.x >= GRID_WIDTH || point.y >= GRID_HEIGHT) {
            return false;
        }

        for (let j = 0; j < this.desks.length; j++) {
            if (this.desks[j].getPosition().x === point.x && this.desks[j].getPosition().y === point.y && this.desks[j] !== object) {
                return false;
            }
        }

        for (let j = 0; j < this.sofas.length; j++) {
            if (this.sofas[j].getPosition().x === point.x && this.sofas[j].getPosition().y === point.y && this.sofas[j] !== object) {
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
            return !Ground.isSittableTaken(sofa, humans);
        });

        if (freeSofas.length === 0) {
            return null;
        }

        return freeSofas[Math.floor(Math.random() * freeSofas.length)];
    }

    static isSittableTaken(sittable: SittableInterface, humans: Human[]) {
        for (let i = 0; i < humans.length; i++) {
            const human = humans[i];
            if (sittable.getPosition().x === human.getPosition().x && sittable.getPosition().y === human.getPosition().y) {
                return true;
            }
        }

        return false;
    }

    getRandomFreeDesk(humans: Human[]) {
        const freeDesks = this.desks.filter((desks) => {
            return !Ground.isSittableTaken(desks, humans);
        });

        if (freeDesks.length === 0) {
            return null;
        }

        return freeDesks[Math.floor(Math.random() * freeDesks.length)];
    }
}
