import {Wall} from "../objects/Wall";
import {Window} from "../objects/Window";
import {Door} from "../objects/Door";
import {Point} from "../Point";

export class WallRepository {
    private walls: Wall[];

    constructor() {
        this.walls = [];
    }

    addWall(cell: Point) {
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
        });

        const graphics = game.add.graphics(0, 0, group);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(-1, -1, 3, 3);
    }

    private getWall(x: number, y: number): Wall {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].getPosition().x === x && this.walls[i].getPosition().y === y) {
                return this.walls[i];
            }
        }

        return null;
    }

    hasWall(x: number, y: number, includeDoor = true): boolean {
        if (includeDoor) {
            return this.getWall(x, y) !== null
        } else {
            return this.getWall(x, y) !== null && this.getWall(x, y).constructor.name !== 'Door';
        }
    }

    getWalls(): Wall[] {
        return this.walls;
    }

    addWindow(cell: Point) {
        this.walls.push(new Window(cell));
    }

    addDoor(cell: Point) {
        this.walls.push(new Door(cell));
    }

    update() {
        this.walls.forEach((wall) => {
            wall.update();
        });
    }
}
