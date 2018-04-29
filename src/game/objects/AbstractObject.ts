import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";
import {ObjectInfoRegistry} from "./ObjectInfoRegistry";
import {DIRECTION} from "../Direction";
import {WorldKnowledge} from "../WorldKnowledge";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {ObjectReferer} from "./ObjectReferer";
import {Employee} from "../human_stuff/Employee";
import {ObjectOrientation} from "./ObjectOrientation";

export abstract class AbstractObject implements InteractiveObjectInterface {
    protected sprites: Phaser.Sprite[];
    protected position: PIXI.Point;
    protected orientation: DIRECTION;
    private worldKnowledge: WorldKnowledge;
    private usedIdentifiers: Employee[];

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge, orientation: DIRECTION) {
        this.position = point;
        this.orientation = orientation;
        this.worldKnowledge = worldKnowledge;
        this.usedIdentifiers = [];
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        this.sprites = [];

        infos.getSpriteInfos(this.orientation).forEach((spriteInfo) => {
            const sprite = game.add.sprite(
                spriteInfo.getRealPosition(this.position, this.orientation).x,
                spriteInfo.getRealPosition(this.position, this.orientation).y,
                spriteInfo.getSpriteName()
            );

            sprite.anchor.set(spriteInfo.getAnchor(sprite).x, spriteInfo.getAnchor(sprite).y);

            if (ObjectOrientation.isLeftOriented(this.orientation)) {
                sprite.scale.set(-1, 1);
            }

            this.sprites.push(sprite);

            groups[GROUP_OBJECTS_AND_HUMANS].add(sprite);
        });
    }

    getPositionGap(subObjectNumber: number): PIXI.Point {
        const sittableObjectInfos =
            ObjectInfoRegistry
                .getObjectInfo(this.constructor.name)
                .getSpriteInfo(this.orientation, subObjectNumber);

        return sittableObjectInfos.getSittablePosition(this.orientation);
    }

    getEntries(objectNumber: number): DIRECTION[] {
        return ObjectInfoRegistry.getObjectInfo(this.constructor.name).getEntryPoints(this.orientation, objectNumber);
    }

    getPositions(): PIXI.Point[] {
        return ObjectInfoRegistry.getObjectInfo(this.constructor.name).getCellGaps(this.orientation).map((gap) => {
            return new PIXI.Point(
                this.position.x + gap.x,
                this.position.y + gap.y
            );
        });
    }

    getSprites(): Phaser.Sprite[] {
        return this.sprites;
    }

    remove(): void {
        this.worldKnowledge.moveToDepot(this);
        this.getSprites().forEach((sprite) => {
            sprite.destroy(true);
        });
    }

    forceOrientation(subObjectNumber: number): boolean {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        return infos.getSpriteInfo(this.orientation, subObjectNumber).getOrientation(this.orientation);
    }

    forceTopOrientation(subObjectNumber: number): boolean {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        return infos.getSpriteInfo(this.orientation, subObjectNumber).getTopOrientation();
    }

    getCellPositionSubObject(subObjectNumber: number): PIXI.Point {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        return new PIXI.Point(
            this.position.x + infos.getPositionGapOfSubObject(this.orientation, subObjectNumber).x,
            this.position.y + infos.getPositionGapOfSubObject(this.orientation, subObjectNumber).y
        );
    }

    isUsed(subObjectNumber: number): boolean {
        return this.getHumanAt(subObjectNumber) !== null;
    }

    getHumanAt(subObjectNumber: number): Employee {
        return this.usedIdentifiers[subObjectNumber] ? this.usedIdentifiers[subObjectNumber] : null;
    }

    getOrigin(): PIXI.Point {
        return this.position;
    }

    setUsed(subObjectNumber: number, human: Employee): void {
        if (this.getHumanAt(subObjectNumber)) {
            debugger;
            throw "This subobject is already taken!"
        }
        this.usedIdentifiers[subObjectNumber] = human;
    }

    setUnused(subObjectNumber: number): void {
        this.usedIdentifiers[subObjectNumber] = null;
    }

    getUnusedReferers(): ObjectReferer[] {
        let result = [];
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);
        for (let i = 0; i < infos.getSpriteInfos(this.orientation).length; i++) {
            if (infos.getSpriteInfos(this.orientation)[i].getEntryPoints(this.orientation).length > 0) {
                if (!this.isUsed(i)) {
                    result.push(new ObjectReferer(this, i));
                }
            }
        }

        return result;
    }

    // TODO Remove
    getLeftOriented(): boolean {
        return ObjectOrientation.isLeftOriented(this.orientation);
    }

    getOrientation(): DIRECTION {
        return this.orientation;
    }
}
