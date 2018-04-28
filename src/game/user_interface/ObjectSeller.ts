import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "../objects/ObjectInfo";
import {ObjectInfoRegistry} from "../objects/ObjectInfoRegistry";
import {ObjectPhantom} from "../objects/ObjectPhantom";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";
import {CELL_HEIGHT, CELL_WIDTH} from "../PositionTransformer";
import {COLOR} from "../Pico8Colors";

export const OBJECT_SELLER_CELL_SIZE = 41;
const CIRCLE_GAP = 7;

export class ObjectSeller {
    private objectProvisionnerButtons: ObjectProvisionnerButton[];
    private sellerButtons: SellerButton[];
    private worldKnowledge: WorldKnowledge;
    private visible: boolean;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;

        this.objectProvisionnerButtons = ObjectInfoRegistry
            .getSellableObjects()
            .map((object) => new ObjectProvisionnerButton(object, this.worldKnowledge));

        this.sellerButtons = ObjectInfoRegistry
            .getSellableObjects()
            .map((object) => new SellerButton(object, this.worldKnowledge));
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }) {
        let i = 0;
        this.objectProvisionnerButtons.forEach((objectProvisionnerButton) => {
            objectProvisionnerButton.create(game, groups, i);
            i++;
        });
        i = 0;
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.create(game, groups, i);
            i++;
        })
    }

    update() {
        this.objectProvisionnerButtons.forEach((objectProvisionnerButton) => {
            objectProvisionnerButton.updateCount(this.getCount(objectProvisionnerButton.getName()))
        });

        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.updateSprites();
        })
    }

    private getCount(name: string): number {
        return this.worldKnowledge.getDepot().getCount(name);
    }

    hide() {
        if (this.visible) {
            this.objectProvisionnerButtons.forEach((objectProvisionnerButton) => {
                objectProvisionnerButton.hide();
            });
            this.sellerButtons.forEach((sellerButton) => {
                sellerButton.hide();
            })
        }
        this.visible = false;
    }

    show() {
        if (!this.visible) {
            this.objectProvisionnerButtons.forEach((objectProvisionnerButton) => {
                objectProvisionnerButton.show();
            });
            this.sellerButtons.forEach((sellerButton) => {
                sellerButton.show();
            })
        }
        this.visible = true;
    }
}

class SellerButton {
    private objectInfo: ObjectInfo;
    private price: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private button: Phaser.Sprite;
    private isDown: boolean;

    constructor(objectInfo: ObjectInfo, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
        this.isDown = false;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * (OBJECT_SELLER_CELL_SIZE / 2);

        const textTop = index * OBJECT_SELLER_CELL_SIZE + 12 + TOP_GAP + CIRCLE_GAP;
        this.price = game.add.text(
            left + OBJECT_SELLER_CELL_SIZE + 10,
            textTop,
            this.objectInfo.getPrice().getStringValue(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );
        groups[GROUP_INTERFACE].add(this.price);

        this.button = game.add.sprite(
            this.price.x + this.price.width + 12,
            textTop,
            'buy_button',
            0,
            groups[GROUP_INTERFACE]
        );

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(this.buy, this, 0);
        this.button.events.onInputUp.add(this.up, this, 0);

        groups[GROUP_INTERFACE].add(this.button);
    }

    updateSprites() {
        if (this.isDown) {
            this.button.loadTexture(this.button.key, 1);
        } else {
            if (this.objectInfo.isSellable(this.worldKnowledge.getMoneyInWallet())) {
                this.button.loadTexture(this.button.key, 0);
            } else {
                this.button.loadTexture(this.button.key, 2);
            }
        }
    }

    buy() {
        if (this.objectInfo.isSellable(this.worldKnowledge.getMoneyInWallet())) {
            this.isDown = true;
            this.worldKnowledge.buy(this.objectInfo.getName(), this.objectInfo.getPrice());
        }
    }

    up() {
        this.isDown = false;
    }

    hide() {
        this.price.position.x += INTERFACE_WIDTH;
        this.button.position.x += INTERFACE_WIDTH;
    }

    show() {
        this.price.position.x -= INTERFACE_WIDTH;
        this.button.position.x -= INTERFACE_WIDTH;
    }
}

class ObjectProvisionnerButton {
    private objectInfo: ObjectInfo;
    private counter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private fakeCells: Phaser.Sprite[];
    private sprites: Phaser.Sprite[];
    private circle: Phaser.Graphics;
    private square: Phaser.Graphics;

    constructor(objectInfo: ObjectInfo, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
        this.sprites = [];
        this.fakeCells = [];
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * OBJECT_SELLER_CELL_SIZE;
        const spriteOrigin = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            top + OBJECT_SELLER_CELL_SIZE
        );

        let width = 1;
        let height = 1;
        this.objectInfo.getCellGaps(false).forEach((gap) => {
            width = Math.max(width, 1 + gap.x);
            height = Math.max(height, 1 + gap.y);
        });
        const scale = 2 / (width + height);

        this.square = game.add.graphics(left, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, groups[GROUP_INTERFACE]);
        this.square.lineStyle(1, COLOR.WHITE);
        this.square.drawRect(0, 0, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);

        this.objectInfo.getCellGaps(false).forEach((cellGap) => {
            const fakeCell = game.add.sprite(
                spriteOrigin.x - (cellGap.x - cellGap.y) * (CELL_WIDTH / 2) * scale,
                spriteOrigin.y - (cellGap.x + cellGap.y) * (CELL_HEIGHT / 2) * scale,
                'casedefault'
            );
            fakeCell.scale.set(scale, scale);
            fakeCell.anchor.set(0.5, 1);
            groups[GROUP_INTERFACE].add(fakeCell);
            this.fakeCells.push(fakeCell);
        });

        this.objectInfo.getSpriteInfos(false).forEach((spriteInfo) => {
            const seller = game.add.sprite(
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, false, scale).x,
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, false, scale).y,
                spriteInfo.getSpriteName()
            );
            seller.scale.set(scale, scale);
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
        this.circle.beginFill(COLOR.RED);
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
    }

    private createPhantom(
        sprite: Phaser.Sprite,
        pointer: Phaser.Pointer,
        game: Phaser.Game,
        groups: {[index: string] : Phaser.Group}
    ) {
        if (this.worldKnowledge.getDepot().getCount(this.objectInfo.getName()) > 0) {
            this.worldKnowledge.getDepot().remove(this.objectInfo.getName());
            const phantom = new ObjectPhantom(this.objectInfo.getName(), game, this.worldKnowledge);
            phantom.create(game, groups);
        }
    }

    hide() {
        this.counter.position.x += INTERFACE_WIDTH;
        this.fakeCells.forEach((fakeCell) => {
            fakeCell.position.x += INTERFACE_WIDTH;
        });
        this.circle.position.x += INTERFACE_WIDTH;
        this.sprites.forEach((sprite) => {
            sprite.position.x += INTERFACE_WIDTH;
        });
        this.square.position.x += INTERFACE_WIDTH + 10;
    }

    show() {
        this.counter.position.x -= INTERFACE_WIDTH;
        this.fakeCells.forEach((fakeCell) => {
            fakeCell.position.x -= INTERFACE_WIDTH;
        });
        this.circle.position.x -= INTERFACE_WIDTH;
        this.sprites.forEach((sprite) => {
            sprite.position.x -= INTERFACE_WIDTH;
        });
        this.square.position.x -= INTERFACE_WIDTH + 10;
    }
}
