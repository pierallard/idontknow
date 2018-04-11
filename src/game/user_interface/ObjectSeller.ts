import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";
import {ObjectInfo} from "../objects/ObjectInfo";
import {ObjectInfoRegistry} from "../objects/ObjectInfoRegistry";
import {ObjectPhantom} from "../objects/ObjectPhantom";
import {GROUP_INFOS, GROUP_INTERFACE, GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";

export const OBJECT_SELLER_CELL_SIZE = 42;

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
}

class SellerButton {
    private objectInfo: ObjectInfo;
    private counter: Phaser.Text;
    private worldKnowledge: WorldKnowledge;

    constructor(objectInfo: ObjectInfo, worldKnowledge: WorldKnowledge) {
        this.objectInfo = objectInfo;
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;
        const spriteSource = new PIXI.Point(
            left + OBJECT_SELLER_CELL_SIZE / 2,
            10 + (index + 1) * OBJECT_SELLER_CELL_SIZE
        );

        const fakeCell = game.add.sprite(spriteSource.x, spriteSource.y, 'casedefault');
        fakeCell.anchor.set(0.5, 1);
        groups[GROUP_INTERFACE].add(fakeCell);

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
            seller.events.onInputDown.add(this.createPhantom, this, 0, game, groups[GROUP_INFOS]);
            groups[GROUP_INTERFACE].add(seller);
        });

        const circle = game.add.graphics(left, index * OBJECT_SELLER_CELL_SIZE + 10, groups[GROUP_INTERFACE]);
        circle.beginFill(0xff0000);
        circle.drawCircle(OBJECT_SELLER_CELL_SIZE, 0, 10);
        groups[GROUP_INTERFACE].add(circle);

        this.counter = game.add.text(left + OBJECT_SELLER_CELL_SIZE - 4, index * OBJECT_SELLER_CELL_SIZE + 10 - 6, '', {
            align: 'center',
            fill: "#ffffff",
            font: '16px 000webfont'
        }, groups[GROUP_INTERFACE]);
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
        group: Phaser.Group
    ) {
        const phantom = new ObjectPhantom(this.objectInfo.getName(), game, this.worldKnowledge);
        phantom.create(game, group);
    }
}
