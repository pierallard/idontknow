import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";
import {ObjectInfoRegistry} from "./ObjectInfoRegistry";
import {DIRECTION} from "../Direction";
import {WorldKnowledge} from "../WorldKnowledge";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {ObjectReferer} from "./ObjectReferer";

export abstract class AbstractObject implements InteractiveObjectInterface {
    protected sprites: Phaser.Sprite[];
    protected position: PIXI.Point;
    protected leftOriented: boolean;
    private worldKnowledge: WorldKnowledge;
    private usedIdentifiers: number[];

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge, leftOriented: boolean) {
        this.position = point;
        this.leftOriented = leftOriented;
        this.worldKnowledge = worldKnowledge;
        this.usedIdentifiers = [];
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        this.sprites = [];

        infos.getSpriteInfos().forEach((spriteInfo) => {
            const sprite = game.add.sprite(
                spriteInfo.getRealPosition(this.position, this.leftOriented).x,
                spriteInfo.getRealPosition(this.position, this.leftOriented).y,
                spriteInfo.getSpriteName()
            );

            sprite.anchor.set(spriteInfo.getAnchor(sprite).x, spriteInfo.getAnchor(sprite).y);

            if (this.leftOriented) {
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
                .getSpriteInfo(subObjectNumber);

        return sittableObjectInfos.getSittablePosition(this.leftOriented);
    }

    getEntries(objectNumber: number): DIRECTION[] {
        return ObjectInfoRegistry.getObjectInfo(this.constructor.name).getEntryPoints(this.leftOriented, objectNumber);
    }

    getPositions(): PIXI.Point[] {
        return ObjectInfoRegistry.getObjectInfo(this.constructor.name).getCellGaps(this.leftOriented).map((gap) => {
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

    forceOrientation(): boolean {
        return this.leftOriented;
    }

    getCellPositionSubObject(subObjectNumber: number): PIXI.Point {
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);

        return new PIXI.Point(
            this.position.x + infos.getPositionGapOfSubObject(this.leftOriented, subObjectNumber).x,
            this.position.y + infos.getPositionGapOfSubObject(this.leftOriented, subObjectNumber).y
        );
    }

    isUsed(subObjectNumber: number): boolean {
        return this.usedIdentifiers.indexOf(subObjectNumber) > -1;
    }

    getOrigin(): PIXI.Point {
        return this.position;
    }

    setUsed(subObjectNumber: number): void {
        this.usedIdentifiers.push(subObjectNumber);
    }

    setUnused(subObjectNumber: number): void {
        const index = this.usedIdentifiers.indexOf(subObjectNumber);
        if (index > -1) {
            this.usedIdentifiers.splice(index, 1);
        }
    }

    getUnusedReferers(): ObjectReferer[] {
        let result = [];
        const infos = ObjectInfoRegistry.getObjectInfo(this.constructor.name);
        for (let i = 0; i < infos.getSpriteInfos().length; i++) {
            if (infos.getSpriteInfos()[i].getEntryPoints(this.leftOriented).length > 0) {
                if (!this.isUsed(i)) {
                    result.push(new ObjectReferer(this, i));
                }
            }
        }

        return result;
    }
}
