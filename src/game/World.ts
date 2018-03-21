import {Ground} from "./Ground";
import {HumanRepository} from "./repositories/HumanRepository";
import {Wall} from "./Wall";

export class World {
    private ground: Ground;
    private humanRepository: HumanRepository;

    constructor() {
        this.ground = new Ground();
        this.humanRepository = new HumanRepository();
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.ground.create(game, groups);

        this.humanRepository.create(game, groups, this);
    }

    update() {
        this.humanRepository.update();
    }

    getGround(): Ground {
        return this.ground;
    }

    humanMoved(positions: PIXI.Point[]) {
        const walls = this.ground.getWallRepository().getWalls();

        walls.forEach((wall: Wall) => {
            let visible = true;
            positions.forEach((position: PIXI.Point) => {
                if (World.humanIsAboveWall(position, wall)) {
                    visible = false;
                }
            });
            wall.setVisibility(visible);
        })
    }

    private static humanIsAboveWall(humanPosition, wall: Wall) {
        const wallPosition = wall.getPosition();

        return (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y);
    }
}