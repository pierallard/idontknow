import {Wall} from "../objects/Wall";
import {GRID_HEIGHT, GRID_WIDTH} from "../WorldKnowledge";

export class WallRepository {
    private walls: Wall[];

    constructor() {
        this.walls = [];
    }

    addWall(cell: PIXI.Point) {
        this.walls.push(new Wall(cell));
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.walls.forEach((wall) => {
            wall.create(
                game,
                group,
                this.hasWall(wall.getPosition().x + 1, wall.getPosition().y),
                this.hasWall(wall.getPosition().x, wall.getPosition().y + 1),
                this.hasWall(wall.getPosition().x - 1, wall.getPosition().y),
                this.hasWall(wall.getPosition().x, wall.getPosition().y - 1),
            );
        })
    }

    private getWall(x: number, y: number): Wall {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].getPosition().x === x && this.walls[i].getPosition().y === y) {
                return this.walls[i];
            }
        }

        return null;
    }

    hasWall(x: number, y: number): boolean {
        return this.getWall(x, y) !== null;
    }

    getWalls(): Wall[] {
        return this.walls;
    }

    initialize() {
        const walls = "" +
            "  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  \n" +
            "  X      X             X   X      X  \n" +
            "  X            X       XX XX      X  \n" +
            "  X      XXXXXXX                  X  \n" +
            "  X      X     XXXXXXXXXXXXX      X  \n" +
            "  X      X     X           X      X  \n" +
            "  X      X     X           X      X  \n" +
            "  X      X     X                  X  \n" +
            "XXXXXX XXX                 XXX XXXXXX\n" +
            "X X            X                    X\n" +
            "X X      X     X           X        X\n" +
            "X X      XXXXXXXXXXXXXXXXXXX        X\n" +
            "X X                                 X\n" +
            "X        X                 X        X\n" +
            "XXXXXXXXXX                 XXXXXXXXXX";
        const lines = walls.split("\n");
        for (let y = 0; y < GRID_HEIGHT; y++) {
            let line = lines[lines.length - 1 - y];
            if (line === undefined) {
                line = Array(lines[0].length).join(' ');
            }
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = line[line.length - 1 - x];
                if (cell === 'X') {
                    this.addWall(new PIXI.Point(x, y));
                }
            }
        }
    }
}
