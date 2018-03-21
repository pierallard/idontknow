import {World} from "../World";
import {PositionTransformer} from "../PositionTransformer";

export default class Play extends Phaser.State {
    private worldKnownledge: World;
    private groups: {[index: string] : Phaser.Group};

    constructor() {
        super();
        this.worldKnownledge = new World();
    }

    public create() {
        this.game.stage.backgroundColor = "#4488AA";
        this.groups = {
            'floor': this.game.add.group(),
            'noname':  this.game.add.group()
        };
        this.worldKnownledge.create(this.game, this.groups);
    }

    update() {
        this.groups['noname'].sort('y', Phaser.Group.SORT_ASCENDING);

        if (this.game.input.activePointer.isDown) {
            const position = PositionTransformer.getCellPosition(this.game.input.activePointer.position);
            this.worldKnownledge.getHumanRepository().getFirstHuman().moveTo(position);
        }
    }
}
