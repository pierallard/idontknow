import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {GROUP_INFOS} from "../game_state/Play";
import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {DeletableObjectInterface} from "./DeletableObjectInterface";

export class Desk extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        super.create(game, groups);

        ObjectDeleter.makeDeletable(this, game, groups[GROUP_INFOS]);
    }

}