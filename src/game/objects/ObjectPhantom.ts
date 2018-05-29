import {ObjectDescriptionRegistry} from "./ObjectDescriptionRegistry";
import {SpriteInfo} from "./SpriteInfo";
import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {ObjectDeleter} from "./ObjectDeleter";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectDescription} from "./ObjectDescription";
import {DIRECTION} from "../Direction";
import {ObjectInterface} from "./ObjectInterface";
import {GROUP_INFOS} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {DIRECTION_LOOP, ObjectOrientation} from "./ObjectOrientation";
import {ObjectSeller} from "../user_interface/ObjectSeller";
import {Point} from "../Point";

const ARROW_SIZE = 0.9;
const GAP = 4;
const SPRITE_OPACITY = 0.7;

export class ObjectPhantom implements ObjectInterface {
    private position: Point;
    private phantomSprites: PhantomSprite[];
    private orientation: DIRECTION;
    private forbiddenSprite: Phaser.Sprite;
    private worldKnowledge: WorldKnowledge;
    private objectDescription: ObjectDescription;
    private putEvent: Function;
    private directionsSprite: DirectionsSprite;
    private game: Phaser.Game;
    private groups: { [index: string]: Phaser.Group };
    private objectSeller: ObjectSeller;

    constructor(objectSeller: ObjectSeller, name, game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        this.objectSeller = objectSeller;
        this.phantomSprites = [];
        this.orientation = DIRECTION_LOOP[0];
        this.worldKnowledge = worldKnowledge;
        this.position = new Point(-10, -10, 0);
        this.objectDescription = ObjectDescriptionRegistry.getObjectDescription(name);

        this.objectDescription.getSpriteInfos(DIRECTION_LOOP[0]).forEach((spriteInfo: SpriteInfo) => {
            this.phantomSprites.push(new PhantomSprite(spriteInfo));
        });

        this.directionsSprite = new DirectionsSprite(this);

        game.input.addMoveCallback((_pointer, x, y) => {
            this.updatePosition(new PIXI.Point(x, y), game.camera);
        }, this);

        this.putEvent = () => {
            if (this.worldKnowledge.canPutHere(this.objectDescription, this.position, this.orientation)) {
                this.put(game);
            }
        };
        game.input.activePointer.leftButton.onDown.add(this.putEvent);
        game.input.keyboard.onUpCallback = (event) => {
            if (event.keyCode == Phaser.Keyboard.ESC) {
                this.cancel(game);
                game.input.moveCallbacks = [];
            } else if (event.keyCode === Phaser.Keyboard.SPACEBAR) {
                this.switchOrientation();
            }
        };
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.game = game;
        this.groups = groups;

        this.directionsSprite.create(game, groups[GROUP_INFOS]);
        this.directionsSprite.setPosition(this.position);

        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.create(game, groups[GROUP_INFOS]);
            phantomSprite.setPosition(this.position);
        });
        this.forbiddenSprite = game.add.sprite(0, 0, 'forbidden');
        this.forbiddenSprite.anchor.setTo(0.5, 0.5);

        groups[GROUP_INFOS].add(this.forbiddenSprite);
    }

    private updatePosition(realPoint: PIXI.Point, camera: Phaser.Camera) {
        const gappedPoint = new PIXI.Point(
            realPoint.x + camera.x,
            realPoint.y + camera.y
        );

        this.position = PositionTransformer.getCellPosition(gappedPoint);
        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.setPosition(this.position);
        });
        this.directionsSprite.setPosition(this.position);
        this.updateForbiddenSprite();
    }

    private switchOrientation() {
        const previousTopOriented = ObjectOrientation.isVerticalMirror(this.orientation);
        this.orientation = ObjectOrientation.getNextOrientation(this.orientation, this.objectDescription.canBeTopOriented());

        if (previousTopOriented !== ObjectOrientation.isVerticalMirror(this.orientation)) {
            this.phantomSprites.forEach((phantomSprite) => {
                phantomSprite.destroy();
            });
            this.phantomSprites = [];

            this.objectDescription.getSpriteInfos(this.orientation).forEach((spriteInfo: SpriteInfo) => {
                this.phantomSprites.push(new PhantomSprite(spriteInfo));
            });

            this.phantomSprites.forEach((phantomSprite) => {
                phantomSprite.create(this.game, this.groups[GROUP_INFOS]);
            })
        }

        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.updateOrientation(this.orientation);
            phantomSprite.setPosition(this.position);
        });
        this.updateForbiddenSprite();
        this.directionsSprite.updatePolygons();
    }

    getPositions(): Point[] {
        return this.objectDescription.getUniqueCellOffsets(this.orientation).map((cellGap) => {
            return this.position.add(cellGap);
        });
    }

    getEntries(objectNumber: number): DIRECTION[] {
        return this.objectDescription.getInteractivePointEntryPoints(this.orientation, objectNumber);
    }

    private updateForbiddenSprite() {
        const center = ObjectDeleter.getCenterOfSprites(this.phantomSprites.map((phantomSprite) => {
            return phantomSprite.getSprite();
        }));
        this.forbiddenSprite.position.set(center.x, center.y);
        this.forbiddenSprite.alpha = this.worldKnowledge.canPutHere(this.objectDescription, this.position, this.orientation) ? 0 : 1;
    }

    private put(game: Phaser.Game) {
        this.worldKnowledge.add(this.objectDescription.getName(), this.getOrigin(), this.orientation);
        this.destroy(game);
        if (this.worldKnowledge.getDepot().getCount(this.objectDescription.getName()) > 0) {
            this.worldKnowledge.getDepot().remove(this.objectDescription.getName());
            const phantom = new ObjectPhantom(this.objectSeller, this.objectDescription.getName(), game, this.worldKnowledge);
            phantom.create(game, this.groups);
            this.objectSeller.setCurrentPhantom(phantom);
        } else {
            this.objectSeller.removeCurrentPhantom();
        }
    }

    cancel(game: Phaser.Game) {
        this.worldKnowledge.getDepot().add(this.objectDescription.getName());
        this.destroy(game);
        this.objectSeller.removeCurrentPhantom();
    }

    private destroy(game: Phaser.Game) {
        game.input.moveCallbacks = [];
        game.input.activePointer.leftButton.onDown.remove(this.putEvent);
        game.input.keyboard.onUpCallback = () => {};

        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.destroy();
        });
        this.forbiddenSprite.destroy(true);
        this.directionsSprite.destroy();
    }

    getObjectDescription(): ObjectDescription {
        return this.objectDescription;
    }

    isEntryAccessible(cellGap: PIXI.Point, direction: DIRECTION) {
        return this.worldKnowledge.isEntryAccessibleForObject(this.position, cellGap, direction);
    }

    isCellFree(): boolean {
        for (let i = 0; i < this.getPositions().length; i++) {
            if (!this.worldKnowledge.isFree(this.getPositions()[i])) {
                return false;
            }
        }

        return true;
    }

    getOrigin(): Point {
        return this.position;
    }

    getOrientation(): DIRECTION {
        return this.orientation;
    }

    getName(): string {
        return this.objectDescription.getName();
    }
}

class DirectionsSprite {
    private graphics: Phaser.Graphics;
    private phantom: ObjectPhantom;

    constructor(phantom: ObjectPhantom) {
        this.phantom = phantom;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.graphics = game.add.graphics(0, 0, group);
        this.updatePolygons();
        group.add(this.graphics);
    }

    updatePolygons() {
        this.graphics.clear();

        this.phantom.getObjectDescription().getInteractivePoints(this.phantom.getOrientation()).forEach((interactivePoint) => {
            interactivePoint.getEntryPoints(this.phantom.getOrientation()).forEach((direction) => {
                const cellGap = interactivePoint.getCellOffset(this.phantom.getOrientation());
                if (this.phantom.isEntryAccessible(cellGap, direction)) {
                    this.graphics.beginFill(COLOR.LIGHT_GREEN); // Green
                } else {
                    this.graphics.beginFill(COLOR.RED); // Red
                }
                const cellGap3D = new Point(cellGap.x, cellGap.y, 0);
                switch (direction) {
                    case DIRECTION.BOTTOM:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(-GAP, CELL_HEIGHT / 2), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2, GAP), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2 * ARROW_SIZE, CELL_HEIGHT / 2 * ARROW_SIZE), cellGap3D),
                        );
                        break;
                    case DIRECTION.LEFT:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2, -GAP), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(-GAP, -CELL_HEIGHT / 2), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2 * ARROW_SIZE, -CELL_HEIGHT / 2 * ARROW_SIZE), cellGap3D),
                        );
                        break;
                    case DIRECTION.TOP:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, -GAP), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(GAP, -CELL_HEIGHT / 2), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2 * ARROW_SIZE, -CELL_HEIGHT / 2 * ARROW_SIZE), cellGap3D),
                        );
                        break;
                    case DIRECTION.RIGHT:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(GAP, CELL_HEIGHT / 2), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, GAP), cellGap3D),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2 * ARROW_SIZE, CELL_HEIGHT / 2 * ARROW_SIZE), cellGap3D),
                        );
                }
            });
        });

        this.graphics.beginFill(this.phantom.isCellFree() ? COLOR.LIGHT_GREEN : COLOR.RED);
        this.phantom.getObjectDescription().getUniqueCellOffsets(this.phantom.getOrientation()).forEach((cellGap) => {
            const cellGap3D = new Point(cellGap.x, cellGap.y, 0);
            this.graphics.drawPolygon(
                PositionTransformer.addGap(new PIXI.Point(- CELL_WIDTH / 2, 0), cellGap3D),
                PositionTransformer.addGap(new PIXI.Point(0, CELL_HEIGHT / 2), cellGap3D),
                PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, 0), cellGap3D),
                PositionTransformer.addGap(new PIXI.Point(0, - CELL_HEIGHT / 2), cellGap3D)
            );
        });
    }

    setPosition(position: Point) {
        this.graphics.x = PositionTransformer.getRealPosition(position).x;
        this.graphics.y = PositionTransformer.getRealPosition(position).y - CELL_HEIGHT / 2;
        this.updatePolygons();
    }

    destroy() {
        this.graphics.destroy(true);
    }
}

class PhantomSprite {
    private sprite: Phaser.Sprite;
    private spriteInfo: SpriteInfo;
    private orientation: DIRECTION;

    constructor(infos: SpriteInfo) {
        this.spriteInfo = infos;
        this.orientation = DIRECTION_LOOP[0];
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(0, 0, this.spriteInfo.getSpriteKey(), 0, group);
        this.sprite.anchor.set(0.5, 1.0 - this.spriteInfo.getAnchorBottom()/this.sprite.height);
        this.sprite.alpha = SPRITE_OPACITY;
    }

    setPosition(position: Point) {
        this.sprite.x = this.spriteInfo.getRealPosition(position, this.orientation).x;
        this.sprite.y = this.spriteInfo.getRealPosition(position, this.orientation).y;
    }

    destroy() {
        this.sprite.destroy(true);
    }

    updateOrientation(orientation: DIRECTION) {
        this.orientation = orientation;
        this.sprite.scale.set(ObjectOrientation.isHorizontalMirror(orientation) ? -1 : 1, 1);
    }

    getSprite() {
        return this.sprite;
    }
}
