import {ObjectInfoRegistry} from "./ObjectInfoRegistry";
import {SpriteInfo} from "./SpriteInfo";
import {CELL_HEIGHT, CELL_WIDTH, PositionTransformer} from "../PositionTransformer";
import {ObjectDeleter} from "./ObjectDeleter";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "./ObjectInfo";
import {DIRECTION} from "../Direction";
import {ObjectInterface} from "./ObjectInterface";
import {GROUP_INFOS} from "../game_state/Play";
import {COLOR} from "../Pico8Colors";
import {DIRECTION_LOOP, ObjectOrientation} from "./ObjectOrientation";

const ARROW_SIZE = 0.9;
const GAP = 4;
const SPRITE_OPACITY = 0.7;

export class ObjectPhantom implements ObjectInterface {
    private position: PIXI.Point;
    private phantomSprites: PhantomSprite[];
    private orientation: DIRECTION;
    private forbiddenSprite: Phaser.Sprite;
    private worldKnowledge: WorldKnowledge;
    private objectInfo: ObjectInfo;
    private putEvent: Function;
    private directionsSprite: DirectionsSprite;
    private game: Phaser.Game;
    private group: Phaser.Group;

    constructor(name, game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        this.phantomSprites = [];
        this.orientation = DIRECTION_LOOP[0];
        this.worldKnowledge = worldKnowledge;
        this.position = new PIXI.Point(-10, -10);
        this.objectInfo = ObjectInfoRegistry.getObjectInfo(name);

        this.objectInfo.getSpriteInfos(DIRECTION_LOOP[0]).forEach((spriteInfo: SpriteInfo) => {
            this.phantomSprites.push(new PhantomSprite(spriteInfo));
        });

        this.directionsSprite = new DirectionsSprite(this);

        game.input.addMoveCallback((_pointer, x, y) => {
            this.updatePosition(new PIXI.Point(x, y), game.camera);
        }, this);

        this.putEvent = () => {
            if (this.worldKnowledge.canPutHere(this.objectInfo, this.position, this.orientation)) {
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
        this.group = groups[GROUP_INFOS];

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

    private cancel(game: Phaser.Game) {
        this.destroy();

        this.worldKnowledge.getDepot().add(this.objectInfo.getName());
        game.input.activePointer.leftButton.onDown.remove(this.putEvent);
    }

    private destroy() {
        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.destroy();
        });
        this.forbiddenSprite.destroy(true);
        this.directionsSprite.destroy();
    }

    private updatePosition(point: PIXI.Point, camera: Phaser.Camera) {
        const gappedPoint = new PIXI.Point(
            point.x + camera.x,
            point.y + camera.y
        );

        this.position = PositionTransformer.getCellPosition(gappedPoint);
        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.setPosition(this.position);
        });
        this.directionsSprite.setPosition(this.position);
        this.updateForbiddenSprite();
    }

    private switchOrientation() {
        const previousTopOriented = ObjectOrientation.isTopOriented(this.orientation);
        this.orientation = ObjectOrientation.getNextOrientation(this.orientation, this.objectInfo.canBeTopOriented());

        if (previousTopOriented !== ObjectOrientation.isTopOriented(this.orientation)) {
            this.phantomSprites.forEach((phantomSprite) => {
                phantomSprite.destroy();
            });
            this.phantomSprites = [];

            this.objectInfo.getSpriteInfos(this.orientation).forEach((spriteInfo: SpriteInfo) => {
                this.phantomSprites.push(new PhantomSprite(spriteInfo));
            });

            this.phantomSprites.forEach((phantomSprite) => {
                phantomSprite.create(this.game, this.group);
            })
        }

        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.updateLeftOriented(ObjectOrientation.isLeftOriented(this.orientation));
            phantomSprite.setPosition(this.position);
        });
        this.updateForbiddenSprite();
        this.directionsSprite.updatePolygons();
    }

    getPositions(): PIXI.Point[] {
        return this.objectInfo.getCellGaps(this.orientation).map((cellGap) => {
            return new PIXI.Point(this.position.x + cellGap.x, this.position.y + cellGap.y)
        });
    }

    getEntries(objectNumber: number): DIRECTION[] {
        return this.objectInfo.getEntryPoints(this.orientation, objectNumber);
    }

    private updateForbiddenSprite() {
        const center = ObjectDeleter.getCenterOfSprites(this.phantomSprites.map((phantomSprite) => {
            return phantomSprite.getSprite();
        }));
        this.forbiddenSprite.position.set(center.x, center.y);
        this.forbiddenSprite.alpha = this.worldKnowledge.canPutHere(this.objectInfo, this.position, this.orientation) ? 0 : 1;
    }

    private put(game: Phaser.Game) {
        game.input.moveCallbacks = [];
        game.input.activePointer.leftButton.onDown.remove(this.putEvent);
        this.worldKnowledge.add(this.objectInfo.getName(), this.getOrigin(), this.orientation);
        this.destroy();
    }

    getInfo(): ObjectInfo {
        return this.objectInfo;
    }

    getLeftOriented(): boolean {
        return ObjectOrientation.isLeftOriented(this.orientation)
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

    getOrigin(): PIXI.Point {
        return this.position;
    }

    getOrientation(): DIRECTION {
        return this.orientation;
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

        this.phantom.getInfo().getSpriteInfos(this.phantom.getOrientation()).forEach((spriteInfo) => {
            spriteInfo.getEntryPoints(this.phantom.getLeftOriented()).forEach((direction) => {
                const cellGap = spriteInfo.getPositionGapFromOrigin(this.phantom.getLeftOriented());
                if (this.phantom.isEntryAccessible(cellGap, direction)) {
                    this.graphics.beginFill(COLOR.LIGHT_GREEN); // Green
                } else {
                    this.graphics.beginFill(COLOR.RED); // Red
                }
                switch (direction) {
                    case DIRECTION.BOTTOM:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(-GAP, CELL_HEIGHT / 2), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2, GAP), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2 * ARROW_SIZE, CELL_HEIGHT / 2 * ARROW_SIZE), cellGap),
                        );
                        break;
                    case DIRECTION.LEFT:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2, -GAP), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(-GAP, -CELL_HEIGHT / 2), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(-CELL_WIDTH / 2 * ARROW_SIZE, -CELL_HEIGHT / 2 * ARROW_SIZE), cellGap),
                        );
                        break;
                    case DIRECTION.TOP:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, -GAP), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(GAP, -CELL_HEIGHT / 2), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2 * ARROW_SIZE, -CELL_HEIGHT / 2 * ARROW_SIZE), cellGap),
                        );
                        break;
                    case DIRECTION.RIGHT:
                        this.graphics.drawPolygon(
                            PositionTransformer.addGap(new PIXI.Point(GAP, CELL_HEIGHT / 2), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, GAP), cellGap),
                            PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2 * ARROW_SIZE, CELL_HEIGHT / 2 * ARROW_SIZE), cellGap),
                        );
                }
            });
        });

        this.graphics.beginFill(this.phantom.isCellFree() ? COLOR.LIGHT_GREEN : COLOR.RED);
        this.phantom.getInfo().getCellGaps(this.phantom.getOrientation()).forEach((cellGap) => {
            this.graphics.drawPolygon(
                PositionTransformer.addGap(new PIXI.Point(- CELL_WIDTH / 2, 0), cellGap),
                PositionTransformer.addGap(new PIXI.Point(0, CELL_HEIGHT / 2), cellGap),
                PositionTransformer.addGap(new PIXI.Point(CELL_WIDTH / 2, 0), cellGap),
                PositionTransformer.addGap(new PIXI.Point(0, - CELL_HEIGHT / 2), cellGap)
            );
        });
    }

    setPosition(position: PIXI.Point) {
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
    private leftOriented: boolean;

    constructor(infos: SpriteInfo) {
        this.spriteInfo = infos;
        this.leftOriented = false;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = game.add.sprite(0, 0, this.spriteInfo.getSpriteName(), 0, group);
        this.sprite.anchor.set(0.5, 1.0 - this.spriteInfo.getAnchorBottom()/this.sprite.height);
        this.sprite.alpha = SPRITE_OPACITY;
    }

    setPosition(position: PIXI.Point) {
        this.sprite.x = this.spriteInfo.getRealPosition(position, this.leftOriented).x;
        this.sprite.y = this.spriteInfo.getRealPosition(position, this.leftOriented).y;
    }

    destroy() {
        this.sprite.destroy(true);
    }

    updateLeftOriented(leftOriented: boolean) {
        this.leftOriented = leftOriented;
        this.sprite.scale.set(leftOriented ? -1 : 1, 1);
    }

    getSprite() {
        return this.sprite;
    }
}
