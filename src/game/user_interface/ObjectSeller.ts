import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "../objects/ObjectInfo";
import {ObjectInfoRegistry} from "../objects/ObjectInfoRegistry";
import {ObjectPhantom} from "../objects/ObjectPhantom";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";

export const OBJECT_SELLER_CELL_SIZE = 42;
const CIRCLE_GAP = 7;

export class ObjectSeller {
    private sellerButtons: SellerButton[];
    private worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge) {
        this.sellerButtons = [];
        this.worldKnowledge = worldKnowledge;
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
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.hide();
        });
    }

    show() {
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.show();
        });
    }
}

class SellerButton {
    private objectInfo: ObjectInfo;
    private counter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private fakeCell: Phaser.Sprite;
    private sprites: Phaser.Sprite[];
    private circle: Phaser.Graphics;

    constructor(objectInfo: ObjectInfo, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
        this.sprites = [];
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const spriteSource = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            TOP_GAP + (index + 1) * OBJECT_SELLER_CELL_SIZE
        );

        this.fakeCell = game.add.sprite(spriteSource.x, spriteSource.y, 'casedefault');
        this.fakeCell.anchor.set(0.5, 1);
        groups[GROUP_INTERFACE].add(this.fakeCell);

        this.objectInfo.getSpriteInfos().forEach((spriteInfo) => {
            const seller = game.add.sprite(
                spriteInfo.getRealPositionFromOrigin(spriteSource, false).x,
                spriteInfo.getRealPositionFromOrigin(spriteSource, false).y,
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

        this.circle = game.add.graphics(left, index * OBJECT_SELLER_CELL_SIZE + TOP_GAP + CIRCLE_GAP, groups[GROUP_INTERFACE]);
        this.circle.beginFill(0xff0000);
        this.circle.drawCircle(OBJECT_SELLER_CELL_SIZE, 0, 10);
        groups[GROUP_INTERFACE].add(this.circle);

        this.counter = game.add.text(left + OBJECT_SELLER_CELL_SIZE - 4, index * OBJECT_SELLER_CELL_SIZE + TOP_GAP + CIRCLE_GAP - 6, '', TEXT_STYLE, groups[GROUP_INTERFACE]);
        groups[GROUP_INTERFACE].add(this.counter);
        this.updateCount(0);
    }

    getName() {
        return this.objectInfo.getName();
    }

    updateCount(count: number) {
        const str = count + '';
        this.counter.setText(str);
        if (str.length > 1) {
            this.counter.position.set(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + OBJECT_SELLER_CELL_SIZE - 4, this.counter.position.y);
        } else {
            this.counter.position.set(CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH + OBJECT_SELLER_CELL_SIZE - 1, this.counter.position.y);
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
        this.counter.alpha = 0;
        this.fakeCell.alpha = 0;
        this.circle.alpha = 0;
        this.sprites.forEach((sprite) => {
            sprite.alpha = 0;
        });
    }

    show() {
        this.counter.alpha = 1;
        this.fakeCell.alpha = 1;
        this.circle.alpha = 1;
        this.sprites.forEach((sprite) => {
            sprite.alpha = 1;
        });
    }
}
