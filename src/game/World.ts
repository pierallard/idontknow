import {Ground} from "./Ground";
import {HumanRepository} from "./repositories/HumanRepository";

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

    getGround(): Ground {
        return this.ground;
    }

    getHumanRepository(): HumanRepository {
        return this.humanRepository;
    }
}