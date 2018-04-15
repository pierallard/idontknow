import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "../objects/ObjectInfo";
import {ObjectInfoRegistry} from "../objects/ObjectInfoRegistry";
import {ObjectPhantom} from "../objects/ObjectPhantom";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";

export const OBJECT_SELLER_CELL_SIZE = 41;
const CIRCLE_GAP = 7;

export class ObjectSeller {
    private sellerButtons: SellerButton[];
    private worldKnowledge: WorldKnowledge;
    private visible: boolean;

    constructor(worldKnowledge: WorldKnowledge) {
        this.sellerButtons = [];
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
        ObjectInfoRegistry.getSellableObjects().forEach((object) => {
            this.sellerButtons.push(new SellerButton(object, this.worldKnowledge));
        });
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }) {
        let i = 0;
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.create(game, groups, i);
            i++;
        });
    }

    update() {
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.updateCount(this.getCount(sellerButton.getName()))
        })
    }

    private getCount(name: string): number {
        return this.worldKnowledge.getDepot().getCount(name);
    }

    hide() {
        if (this.visible) {
            this.sellerButtons.forEach((sellerButton) => {
                sellerButton.hide();
            });
        }
        this.visible = false;
    }

    show() {
        if (!this.visible) {
            this.sellerButtons.forEach((sellerButton) => {
                sellerButton.show();
            });
        }
        this.visible = true;
    }
}

class SellerButton {
    private objectInfo: ObjectInfo;
    private counter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private fakeCell: Phaser.Sprite;
    private sprites: Phaser.Sprite[];
    private circle: Phaser.Graphics;
    private square: Phaser.Graphics;

    constructor(objectInfo: ObjectInfo, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
        this.sprites = [];
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * OBJECT_SELLER_CELL_SIZE;
        const spriteOrigin = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            top + OBJECT_SELLER_CELL_SIZE
        );

        this.square = game.add.graphics(left, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, groups[GROUP_INTERFACE]);
        this.square.lineStyle(1, 0xffffff);
        this.square.drawRect(0, 0, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);

        this.fakeCell = game.add.sprite(spriteOrigin.x, spriteOrigin.y, 'casedefault');
        this.fakeCell.anchor.set(0.5, 1);
        groups[GROUP_INTERFACE].add(this.fakeCell);

        this.objectInfo.getSpriteInfos().forEach((spriteInfo) => {
            const seller = game.add.sprite(
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, false).x,
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, false).y,
                spriteInfo.getSpriteName()
            );
            seller.anchor.set(spriteInfo.getAnchor(seller).x, spriteInfo.getAnchor(seller).y);
            seller.inputEnabled = true;
            seller.input.pixelPerfectOver = true;
            seller.input.pixelPerfectClick = true;
            seller.input.useHandCursor = true;
            seller.events.onInputDown.add(this.createPhantom, this, 0, game, groups);
            this.sprites.push(seller);
            groups[GROUP_INTERFACE].add(seller);
        });

        this.circle = game.add.graphics(left, top + CIRCLE_GAP, groups[GROUP_INTERFACE]);
        this.circle.beginFill(0xff0000);
        this.circle.drawCircle(OBJECT_SELLER_CELL_SIZE, 0, 9);
        groups[GROUP_INTERFACE].add(this.circle);

        this.counter = game.add.text(left + OBJECT_SELLER_CELL_SIZE - 1.5, index * OBJECT_SELLER_CELL_SIZE + TOP_GAP + CIRCLE_GAP - 5, '0', TEXT_STYLE, groups[GROUP_INTERFACE]);
        groups[GROUP_INTERFACE].add(this.counter);
        this.updateCount(0);
    }

    getName() {
        return this.objectInfo.getName();
    }

    updateCount(count: number) {
        const str = count + '';
        const previousStr = this.counter.text;
        const diff = str.length - previousStr.length;
        this.counter.setText(str);
        this.counter.position.x -= diff * 3;
        if (count == 0) {
            this.hide();
        } else {
            this.show();
        }
    }

    private createPhantom(
        sprite: Phaser.Sprite,
        pointer: Phaser.Pointer,
        game: Phaser.Game,
        groups: {[index: string] : Phaser.Group}
    ) {
        this.worldKnowledge.getDepot().remove(this.objectInfo.getName());
        const phantom = new ObjectPhantom(this.objectInfo.getName(), game, this.worldKnowledge);
        phantom.create(game, groups);
    }

    hide() {
        this.counter.position.x += INTERFACE_WIDTH;
        this.fakeCell.position.x += INTERFACE_WIDTH;
        this.circle.position.x += INTERFACE_WIDTH;
        this.sprites.forEach((sprite) => {
            sprite.position.x += INTERFACE_WIDTH;
        });
        this.square.position.x += INTERFACE_WIDTH + 10;
    }

    show() {
        this.counter.position.x -= INTERFACE_WIDTH;
        this.fakeCell.position.x -= INTERFACE_WIDTH;
        this.circle.position.x -= INTERFACE_WIDTH;
        this.sprites.forEach((sprite) => {
            sprite.position.x -= INTERFACE_WIDTH;
        });
        this.square.position.x -= INTERFACE_WIDTH + 10;
    }
}
