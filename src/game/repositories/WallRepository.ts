import {Wall} from "../Wall";

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

    hasWall(x: number, y: number): boolean {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].getPosition().x === x && this.walls[i].getPosition().y === y) {
                return true;
            }
        }

        return false;
    }

    getWalls(): Wall[] {
        return this.walls;
    }
}