import {ObjectInfoRegistry} from "./ObjectInfoRegistry";
import {SpriteInfo} from "./SpriteInfo";
import {PositionTransformer} from "../PositionTransformer";
import {ObjectDeleter} from "./ObjectDeleter";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "./ObjectInfo";

export class ObjectPhantom {
    private position: PIXI.Point;
    private phantomSprites: PhantomSprite[];
    private leftOriented: boolean;
    private forbiddenSprite: Phaser.Sprite;
    private worldKnowledge: WorldKnowledge;
    private objectInfo: ObjectInfo;
    private putEvent: Function;

    constructor(name, game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        this.phantomSprites = [];
        this.leftOriented = false;
        this.worldKnowledge = worldKnowledge;
        this.position = new PIXI.Point(-10, -10);
        this.objectInfo = ObjectInfoRegistry.getObjectInfo(name);

        this.objectInfo.getSpriteInfos().forEach((spriteInfo: SpriteInfo) => {
            this.phantomSprites.push(new PhantomSprite(spriteInfo));
        });

        game.input.addMoveCallback((_pointer, x, y) => {
            this.updatePosition(new PIXI.Point(x, y), game.camera);
        }, this);

        this.putEvent = () => {
            if (this.worldKnowledge.canPutHere(this)) {
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

    create(game: Phaser.Game, group: Phaser.Group) {
        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.create(game, group);
            phantomSprite.setPosition(this.position);
        });
        this.forbiddenSprite = game.add.sprite(0, 0, 'forbidden');
        this.forbiddenSprite.anchor.setTo(0.5, 0.5);
        group.add(this.forbiddenSprite);
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
        this.updateForbiddenSprite();
    }

    private switchOrientation() {
        this.leftOriented = !this.leftOriented;
        this.phantomSprites.forEach((phantomSprite) => {
            phantomSprite.updateOrientation(this.leftOriented);
            phantomSprite.setPosition(this.position);
        });
        this.updateForbiddenSprite();
    }

    getPosition(): PIXI.Point {
        return this.position;
    }

    getEntries() {
        return this.objectInfo.getEntryPoints(this.leftOriented);
    }

    private updateForbiddenSprite() {
        const center = ObjectDeleter.getCenterOfSprites(this.phantomSprites.map((phantomSprite) => {
            return phantomSprite.getSprite();
        }));
        this.forbiddenSprite.position.set(center.x, center.y);
        this.forbiddenSprite.alpha = this.worldKnowledge.canPutHere(this) ? 0 : 1;
    }

    private put(game: Phaser.Game) {
        game.input.activePointer.leftButton.onDown.remove(this.putEvent);
        this.worldKnowledge.add(this.objectInfo.getName(), this.getPosition(), this.leftOriented);
        this.destroy();
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
        this.sprite.alpha = 0.8;
    }

    setPosition(position: PIXI.Point) {
        this.sprite.x = this.spriteInfo.getRealPosition(position, this.leftOriented).x;
        this.sprite.y = this.spriteInfo.getRealPosition(position, this.leftOriented).y;
    }

    destroy() {
        this.sprite.destroy(true);
    }

    updateOrientation(leftOriented: boolean) {
        this.leftOriented = leftOriented;
        this.sprite.scale.set(this.leftOriented ? -1 : 1, 1);
    }

    getSprite() {
        return this.sprite;
    }
}