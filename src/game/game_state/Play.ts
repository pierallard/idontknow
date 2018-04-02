import {WorldKnowledge} from "../WorldKnowledge";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS, WORLD_HEIGHT, WORLD_WIDTH} from "../../app";

export default class Play extends Phaser.State {
    private worldKnowledge: WorldKnowledge;
    private groups: {[index: string] : Phaser.Group};

    constructor() {
        super();
        this.worldKnowledge = new WorldKnowledge();
    }

    public create() {
        this.game.stage.backgroundColor = "#4488AA";
        this.groups = {
            'floor': this.game.add.group(),
            'noname':  this.game.add.group()
        };
        this.worldKnowledge.create(this.game, this.groups);
        this.game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.game.camera.setPosition((WORLD_WIDTH - CAMERA_WIDTH_PIXELS) / 2, (WORLD_HEIGHT - CAMERA_HEIGHT_PIXELS) / 2);
    }

    update(game: Phaser.Game) {
        this.groups['noname'].sort('y', Phaser.Group.SORT_ASCENDING);
        this.worldKnowledge.update();

        const selected = this.worldKnowledge.getSelectedHumanSprite();
        if (selected) {
            this.game.camera.follow(selected, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }
    }
}
