import {Wall} from "../objects/Wall";

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
}
