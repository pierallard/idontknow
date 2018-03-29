import {Ground} from "./Ground";
import {HumanRepository} from "./repositories/HumanRepository";
import {Wall} from "./Wall";
import {Sofa} from "./objects/Sofa";
import {SittableInterface} from "./objects/SittableInterface";

export class World {
    private ground: Ground;
    private humanRepository: HumanRepository;

    constructor() {
        this.ground = new Ground();
        this.humanRepository = new HumanRepository(this);
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
                if (this.anyHumanIsAboveWall(wall)) {
                    visible = false;
                }
            });
            wall.setVisibility(visible);
        })
    }

    private anyHumanIsAboveWall(wall: Wall) {
        const humans = this.humanRepository.humans;
        for (let i = 0; i < humans.length; i++) {
            if (World.humanIsAboveWall(humans[i].getPosition(), wall)) {
                return true;
            }
        }

        return false;
    }

    private static humanIsAboveWall(humanPosition, wall: Wall) {
        const wallPosition = wall.getPosition();

        return (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y);
    }

    getRandomFreeSofa(): Sofa {
        return this.ground.getRandomFreeSofa(this.humanRepository.humans);
    }

    isSittableTaken(sittable: SittableInterface) {
        return Ground.isSittableTaken(sittable, this.humanRepository.humans);
    }

    getRandomFreeDesk() {
        return this.ground.getRandomFreeDesk(this.humanRepository.humans);
    }

    getSelectedHumanSprite() {
        return this.humanRepository.getSelectedHumanSprite();
    }
}
