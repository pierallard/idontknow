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
        this.groups['noname'].customSort((obj1: Phaser.Sprite, obj2: Phaser.Sprite) => {
            const bottom1 = obj1.y - (1.0 - obj1.anchor.y) * obj1.height;
            const bottom2 = obj2.y - (1.0 - obj2.anchor.y) * obj2.height;

            return bottom1 - bottom2;
        });
        this.worldKnowledge.update();
    }
}
