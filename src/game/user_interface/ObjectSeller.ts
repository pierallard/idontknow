import {INTERFACE_WIDTH, TOP_GAP} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectDescription} from "../objects/ObjectDescription";
import {ObjectDescriptionRegistry} from "../objects/ObjectDescriptionRegistry";
import {ObjectPhantom} from "../objects/ObjectPhantom";
import {GROUP_INTERFACE} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";
import {CELL_HEIGHT, CELL_WIDTH} from "../PositionTransformer";
import {COLOR} from "../Pico8Colors";
import {DIRECTION_LOOP} from "../objects/ObjectOrientation";
import {SMALL_GAP_BETWEEN_LINES} from "./UserInfoPanel";

export const OBJECT_SELLER_CELL_SIZE = 41;
const CIRCLE_GAP = 7;

export class ObjectSeller {
    private objectProvisionnerButtons: ObjectProvisionnerButton[];
    private sellerButtons: SellerButton[];
    private worldKnowledge: WorldKnowledge;
    private visible: boolean;
    private currentPhantom: ObjectPhantom;
    private game: Phaser.Game;
    private groups: {[index: string]: Phaser.Group};

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.visible = true;
        this.currentPhantom = null;
        this.objectProvisionnerButtons = [];
        this.sellerButtons = [];
    }

    create(game: Phaser.Game, groups: {[index: string]: Phaser.Group }) {
        this.game = game;
        this.groups = groups;
        this.addMissingButtons();
    }

    private addMissingButtons() {
        ObjectDescriptionRegistry
            .getSalableObjects(this.worldKnowledge.getLevel())
            .forEach((objectDescription) => {
                if (this.objectProvisionnerButtons.filter((previsionner) => {
                    return previsionner.getName() === objectDescription.getName()
                }).length === 0) {
                    const objectProvisionnerButton = new ObjectProvisionnerButton(this, objectDescription, this.worldKnowledge);
                    const sellerButton = new SellerButton(objectDescription, this.worldKnowledge);
                    objectProvisionnerButton.create(this.game, this.groups, this.objectProvisionnerButtons.length);
                    sellerButton.create(this.game, this.groups, this.sellerButtons.length);
                    if (!this.visible) {
                        objectProvisionnerButton.hide();
                        sellerButton.hide();
                    }
                    this.objectProvisionnerButtons.push(objectProvisionnerButton);
                    this.sellerButtons.push(sellerButton);
                }
        });
    }

    update() {
        this.objectProvisionnerButtons.forEach((objectProvisionnerButton) => {
            objectProvisionnerButton.updateCount(this.getCount(objectProvisionnerButton.getName()))
        });

        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.updateSprites();
        });

        this.addMissingButtons();
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

    setCurrentPhantom(phantom: ObjectPhantom) {
        this.currentPhantom = phantom;
    }

    removeCurrentPhantom() {
        this.currentPhantom = null;
    }

    getCurrentPhantom(): ObjectPhantom {
        return this.currentPhantom;
    }
}

class SellerButton {
    private objectInfo: ObjectDescription;
    private price: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private button: Phaser.Sprite;
    private isDown: boolean;
    private objectName: Phaser.Text;

    constructor(objectInfo: ObjectDescription, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
        this.isDown = false;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const top = TOP_GAP + index * OBJECT_SELLER_CELL_SIZE;

        this.objectName = game.add.text(
            left + OBJECT_SELLER_CELL_SIZE + 10,
            top,
            this.objectInfo.getName(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );
        this.price = game.add.text(
            left + OBJECT_SELLER_CELL_SIZE + 10,
            top + SMALL_GAP_BETWEEN_LINES,
            this.objectInfo.getPrice().getStringValue(),
            TEXT_STYLE,
            groups[GROUP_INTERFACE]
        );
        groups[GROUP_INTERFACE].add(this.price);

        this.button = game.add.sprite(
            left + OBJECT_SELLER_CELL_SIZE + 10,
            top + SMALL_GAP_BETWEEN_LINES * 2 + 3,
            'buy_button',
            0,
            groups[GROUP_INTERFACE]
        );

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(this.buy, this, 0);
        this.button.events.onInputUp.add(this.up, this, 0);
        this.button.anchor.setTo(0, 0);

        groups[GROUP_INTERFACE].add(this.button);
    }

    updateSprites() {
        if (this.isDown) {
            this.button.loadTexture(this.button.key, 1);
        } else {
            if (this.objectInfo.isSalable(this.worldKnowledge.getMoneyInWallet())) {
                this.button.loadTexture(this.button.key, 0);
            } else {
                this.button.loadTexture(this.button.key, 2);
            }
        }
    }

    buy() {
        if (this.objectInfo.isSalable(this.worldKnowledge.getMoneyInWallet())) {
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
        this.objectName.position.x += INTERFACE_WIDTH;
    }

    show() {
        this.price.position.x -= INTERFACE_WIDTH;
        this.button.position.x -= INTERFACE_WIDTH;
        this.objectName.position.x -= INTERFACE_WIDTH;
    }
}

class ObjectProvisionnerButton {
    private objectInfo: ObjectDescription;
    private counter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;
    private fakeCells: Phaser.Sprite[];
    private sprites: Phaser.Sprite[];
    private circle: Phaser.Graphics;
    private square: Phaser.Graphics;
    private objectSeller: ObjectSeller;

    constructor(objectSeller: ObjectSeller, objectInfo: ObjectDescription, worldKnowledge: WorldKnowledge) {
        this.objectSeller = objectSeller;
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
        this.objectInfo.getUniqueCellOffsets(DIRECTION_LOOP[0]).forEach((gap) => {
            width = Math.max(width, 1 + gap.x);
            height = Math.max(height, 1 + gap.y);
        });
        const scale = 2 / (width + height);

        if (height !== width) {
            // TODO, works not for every case.
            spriteOrigin.x = left + OBJECT_SELLER_CELL_SIZE / (height + width) * (1);
            // W = 1 H = 2 => 1/3 1 - 2 = -1
            // W = 1 H = 1 => 1/2 1 - 1 = 0
            // W = 2 H = 1 => 2/3 2 - 1 = 1
            // Change sprite Origin
        }

        this.square = game.add.graphics(left, TOP_GAP + index * OBJECT_SELLER_CELL_SIZE, groups[GROUP_INTERFACE]);
        this.square.lineStyle(1, COLOR.WHITE);
        this.square.drawRect(0, 0, OBJECT_SELLER_CELL_SIZE, OBJECT_SELLER_CELL_SIZE);

        this.objectInfo.getUniqueCellOffsets(DIRECTION_LOOP[0]).forEach((cellGap) => {
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

        this.objectInfo.getSpriteInfos(DIRECTION_LOOP[0]).forEach((spriteInfo) => {
            const seller = game.add.sprite(
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, DIRECTION_LOOP[0], scale).x,
                spriteInfo.getRealPositionFromOrigin(spriteOrigin, DIRECTION_LOOP[0], scale).y,
                spriteInfo.getSpriteKey()
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
        if (this.objectSeller.getCurrentPhantom() && this.objectSeller.getCurrentPhantom().getName() === this.objectInfo.getName()) {
            this.objectSeller.getCurrentPhantom().cancel(game);
            return;
        }
        if (this.objectSeller.getCurrentPhantom() && this.objectSeller.getCurrentPhantom().getName() !== this.objectInfo.getName()) {
            this.objectSeller.getCurrentPhantom().cancel(game);
        }
        if (this.worldKnowledge.getDepot().getCount(this.objectInfo.getName()) > 0) {
            this.worldKnowledge.getDepot().remove(this.objectInfo.getName());
            const phantom = new ObjectPhantom(this.objectSeller, this.objectInfo.getName(), game, this.worldKnowledge);
            phantom.create(game, groups);
            this.objectSeller.setCurrentPhantom(phantom);
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
