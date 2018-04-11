import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {DeletableObjectInterface} from "./DeletableObjectInterface";
import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {GROUP_INFOS} from "../game_state/Play";

export class Dispenser extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        super.create(game, groups);

        ObjectDeleter.makeDeletable(this, game, groups[GROUP_INFOS]);
    }

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(0, 0);
    }

    forceOrientation(): boolean {
        return true;
    }
}
