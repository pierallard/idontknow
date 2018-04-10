import {PositionTransformer} from "../PositionTransformer";
import {WorldKnowledge} from "../WorldKnowledge";
import {DIRECTION} from "../Direction";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {ObjectDeleter} from "./ObjectDeleter";
import {DeletableObjectInterface} from "./DeletableObjectInterface";
import {GROUP_INFOS, GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";

const DISPENSER_BOTTOM = -4;
const DISPENSER_LEFT = 4;
const DISPENSER_ANCHOR_BOTTOM = 3;

export class Dispenser implements InteractiveObjectInterface, DeletableObjectInterface {
    private sprite: Phaser.Sprite;
    private position: PIXI.Point;
    private worldKnowledge: WorldKnowledge;

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge) {
        this.position = point;
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.sprite = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x + DISPENSER_LEFT,
            PositionTransformer.getRealPosition(this.position).y + DISPENSER_BOTTOM - DISPENSER_ANCHOR_BOTTOM,
            'dispenser'
        );
        this.sprite.anchor.set(0.5, 1.0 - DISPENSER_ANCHOR_BOTTOM/this.sprite.height);

        // ObjectMover.makeMovable(this, this.worldKnowledge);
        ObjectDeleter.makeDeletable(this, game, groups[GROUP_INFOS]);

        groups[GROUP_OBJECTS_AND_HUMANS].add(this.sprite);
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getSprites(): Phaser.Sprite[] {
        return [this.sprite];
    }

    getEntries(): DIRECTION[] {
        return [DIRECTION.BOTTOM];
    }

    getPositionGap(): PIXI.Point {
        return new PIXI.Point(0, 0);
    }

    forceOrientation(): boolean {
        return true;
    }

    remove(): void {
        this.worldKnowledge.moveToDepot(this);
        this.sprite.destroy(true);
    }
}
