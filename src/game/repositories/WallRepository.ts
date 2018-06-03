import {Wall} from "../objects/Wall";
import {Window} from "../objects/Window";
import {Door} from "../objects/Door";
import {Point} from "../Point";
import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";

export class WallRepository {
    private walls: Wall[];

    constructor() {
        this.walls = [];
    }

    addWall(cell: Point) {
        this.walls.push(new Wall(cell));
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.walls.forEach((wall) => {
            wall.create(
                game,
                groups[GROUP_OBJECTS_AND_HUMANS + wall.getPosition().z],
                this.hasWall(new Point(wall.getPosition().x + 1, wall.getPosition().y, wall.getPosition().z)),
                this.hasWall(new Point(wall.getPosition().x, wall.getPosition().y + 1, wall.getPosition().z)),
                this.hasWall(new Point(wall.getPosition().x - 1, wall.getPosition().y, wall.getPosition().z)),
                this.hasWall(new Point(wall.getPosition().x, wall.getPosition().y - 1, wall.getPosition().z)),
            );
        });
    }

    private getWall(point: Point): Wall {
        for (let i = 0; i < this.walls.length; i++) {
            if (this.walls[i].getPosition().equals(point)) {
                return this.walls[i];
            }
        }

        return null;
    }

    hasWall(point: Point, includeDoor = true): boolean {
        if (includeDoor) {
            return this.getWall(point) !== null
        } else {
            return this.getWall(point) !== null && this.getWall(point).constructor.name !== 'Door';
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
