import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {GROUP_INFOS} from "../game_state/Play";
import {DeletableObjectInterface} from "./DeletableObjectInterface";
import {Price} from "./Price";

export class Sofa extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        super.create(game, groups);

        ObjectDeleter.makeDeletable(this, game, groups[GROUP_INFOS]);
    }

    forceOrientation(): boolean {
        return null;
    }

    static getPrice(): Price {
        return new Price(150);
    }
}
