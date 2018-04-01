import {Ground} from "./Ground";
import {HumanRepository} from "./repositories/HumanRepository";
import {Wall} from "./Wall";
import {Sofa} from "./objects/Sofa";
import {SittableInterface} from "./objects/SittableInterface";
import {ObjectInterface} from "./objects/ObjectInterface";
import {Human} from "./human_stuff/Human";
import {Desk} from "./objects/Desk";

export class World {
    private ground: Ground;
    private humanRepository: HumanRepository;

    constructor() {
        this.ground = new Ground(this);
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

    getRandomFreeDesk(): Desk {
        return this.ground.getRandomFreeDesk(this.humanRepository.humans);
    }

    getSelectedHumanSprite() {
        return this.humanRepository.getSelectedHumanSprite();
    }

    isFreePosition(tryPosition: PIXI.Point, object: ObjectInterface) {
        return this.ground.isFree(tryPosition, object);
    }

    resetAStar(startPosition: PIXI.Point, endPosition: PIXI.Point) {
        this.humanRepository.humans.forEach((human) => {
            human.resetAStar(startPosition, endPosition);
        });
    }

    getAnotherFreeHuman(human: Human): Human {
        const availableHumans = this.humanRepository.humans.filter((anotherHuman: Human) => {
            return anotherHuman !== human && anotherHuman.isFree()
        });

        if (availableHumans.length === 0) {
            return null;
        }

        return availableHumans[Math.floor(Math.random() * availableHumans.length)];
    }
}
