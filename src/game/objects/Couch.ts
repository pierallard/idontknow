import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {GROUP_INFOS} from "../game_state/Play";

export class Couch extends AbstractObject {
    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        super.create(game, groups);

        ObjectDeleter.makeDeletable(this, game, groups[GROUP_INFOS]);
    }
}