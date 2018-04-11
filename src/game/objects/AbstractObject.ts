import {GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";
import {ObjectInfoRegistry} from "./ObjectInfoRegistry";
import {DIRECTION} from "../Direction";
import {WorldKnowledge} from "../WorldKnowledge";

export abstract class AbstractObject {
    protected sprites: Phaser.Sprite[];
    protected position: PIXI.Point;
    protected leftOriented: boolean;
    private worldKnowledge: WorldKnowledge;

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge, leftOriented: boolean) {
        this.position = point;
        this.leftOriented = leftOriented;
        this.worldKnowledge = worldKnowledge;
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

    getPositionGap(): PIXI.Point {
        const sittableObjectInfos = ObjectInfoRegistry.getObjectInfo(this.constructor.name).getSpriteInfos()[0];
        return sittableObjectInfos.getSittablePosition(this.leftOriented);
    }

    getEntries(): DIRECTION[] {
        return ObjectInfoRegistry.getObjectInfo(this.constructor.name).getEntryPoints(this.leftOriented);
    }

    getPosition(): PIXI.Point {
        return this.position;
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
}