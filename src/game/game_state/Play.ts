import {World} from "../World";

export default class Play extends Phaser.State {
    private worldKnowledge: World;
    private groups: {[index: string] : Phaser.Group};

    constructor() {
        super();
        this.worldKnowledge = new World();
    }

    public create() {
        this.game.stage.backgroundColor = "#4488AA";
        this.groups = {
            'floor': this.game.add.group(),
            'noname':  this.game.add.group()
        };
        this.worldKnowledge.create(this.game, this.groups);
    }

    update() {
        this.groups['noname'].sort('y', Phaser.Group.SORT_ASCENDING);
        this.worldKnowledge.update();
    }
}
