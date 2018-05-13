import {GROUP_INTERFACE, GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";
import {ObjectDescriptionRegistry} from "./ObjectDescriptionRegistry";
import {DIRECTION} from "../Direction";
import {WorldKnowledge} from "../WorldKnowledge";
import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {ObjectReferer} from "./ObjectReferer";
import {Employee} from "../human_stuff/Employee";
import {ObjectOrientation} from "./ObjectOrientation";
import {COLOR} from "../Pico8Colors";
import {ObjectDescription} from "./ObjectDescription";

export const SPRITE_DEBUG = false;

export abstract class AbstractObject implements InteractiveObjectInterface {
    protected sprites: Phaser.Sprite[];
    protected position: PIXI.Point;
    protected orientation: DIRECTION;
    private worldKnowledge: WorldKnowledge;
    private usedIdentifiers: Employee[];
    private debugGraphics: Phaser.Graphics;

    constructor(point: PIXI.Point, worldKnowledge: WorldKnowledge, orientation: DIRECTION) {
        this.position = point;
        this.orientation = orientation;
        this.worldKnowledge = worldKnowledge;
        this.usedIdentifiers = [];
    }

    getDescription(): ObjectDescription {
        let name = this.constructor.name;
        name = name.split(/(?=[A-Z])/).join(' ');
        return ObjectDescriptionRegistry.getObjectDescription(name);
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        const infos = this.getDescription();

        this.sprites = [];

        infos.getSpriteInfos(this.orientation).forEach((spriteInfo) => {
            const sprite = game.add.sprite(
                spriteInfo.getRealPosition(this.position, this.orientation).x,
                spriteInfo.getRealPosition(this.position, this.orientation).y,
                spriteInfo.getSpriteKey()
            );

            sprite.anchor.set(spriteInfo.getAnchor(sprite).x, spriteInfo.getAnchor(sprite).y);

            if (ObjectOrientation.isHorizontalMirror(this.orientation)) {
                sprite.scale.set(-1, 1);
            }

            this.sprites.push(sprite);

            groups[GROUP_OBJECTS_AND_HUMANS].add(sprite);
        });

        if (SPRITE_DEBUG) {
            this.debugGraphics = game.add.graphics(0, 0, groups[GROUP_INTERFACE]);

            infos.getSpriteInfos(this.orientation).forEach((spriteInfo) => {
                this.debugGraphics.lineStyle(1, COLOR.LIGHT_GREEN);
                const realPosition = spriteInfo.getRealPosition(this.position, this.orientation);
                this.debugGraphics.moveTo(realPosition.x - 1.5, realPosition.y + 0.5);
                this.debugGraphics.lineTo(realPosition.x + 2.5, realPosition.y + 0.5);
                this.debugGraphics.moveTo(realPosition.x + 0.5, realPosition.y - 1.5);
                this.debugGraphics.lineTo(realPosition.x + 0.5, realPosition.y + 2.5);
            });
        }
    }

    getPositionGap(interactivePointIdentifier: number): PIXI.Point {
        const interactivePointDescription =
            ObjectDescriptionRegistry
                .getObjectDescription(this.constructor.name)
                .getInteractivePoints(this.orientation)[interactivePointIdentifier];

        return interactivePointDescription.getInteractionPosition(this.orientation);
    }

    getEntries(objectNumber: number): DIRECTION[] {
        return this.getDescription().getInteractivePointEntryPoints(this.orientation, objectNumber);
    }

    getPositions(): PIXI.Point[] {
        return this.getDescription().getUniqueCellOffsets(this.orientation).map((gap) => {
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
        this.worldKnowledge.resetAStar();
        this.getSprites().forEach((sprite) => {
            sprite.destroy(true);
        });
        if (this.debugGraphics) {
            this.debugGraphics.destroy(true);
        }
    }

    forceLeftOrientation(interactivePointIdentifier: number): boolean {
        const infos = this.getDescription();

        return infos.getInteractivePoints(this.orientation)[interactivePointIdentifier].isHumanLeftLooking(this.orientation);
    }

    forceTopOrientation(interactivePointIdentifier: number): boolean {
        const infos = this.getDescription();

        return infos.getInteractivePoints(this.orientation)[interactivePointIdentifier].isHumanTopLooking();
    }

    getCellPositionSubObject(interactivePointIdentifier: number): PIXI.Point {
        const infos = this.getDescription();

        return new PIXI.Point(
            this.position.x + infos.getInteractivePointCellOffset(this.orientation, interactivePointIdentifier).x,
            this.position.y + infos.getInteractivePointCellOffset(this.orientation, interactivePointIdentifier).y
        );
    }

    isUsed(interactivePointIdentifier: number): boolean {
        return this.getHumanAt(interactivePointIdentifier) !== null;
    }

    getHumanAt(interactivePointIdentifier: number): Employee {
        return this.usedIdentifiers[interactivePointIdentifier] ? this.usedIdentifiers[interactivePointIdentifier] : null;
    }

    getOrigin(): PIXI.Point {
        return this.position;
    }

    setUsed(interactivePointIdentifier: number, human: Employee): void {
        if (this.getHumanAt(interactivePointIdentifier)) {
            debugger;
            throw "This subobject is already taken!"
        }
        this.usedIdentifiers[interactivePointIdentifier] = human;
    }

    setUnused(interactivePointIdentifier: number): void {
        this.usedIdentifiers[interactivePointIdentifier] = null;
    }

    getUnusedReferers(): ObjectReferer[] {
        let result = [];
        const description = this.getDescription();
        for (let i = 0; i < description.getInteractivePoints(this.orientation).length; i++) {
            if (!this.isUsed(i)) {
                result.push(new ObjectReferer(this, i));
            }
        }

        return result;
    }

    getOrientation(): DIRECTION {
        return this.orientation;
    }
}
