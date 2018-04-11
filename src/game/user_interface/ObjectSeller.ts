import {Sofa} from "../objects/Sofa";
import {Desk} from "../objects/Desk";
import {Dispenser} from "../objects/Dispenser";
import {INTERFACE_WIDTH} from "./UserInterface";
import {CAMERA_WIDTH_PIXELS} from "../../app";
import {WorldKnowledge} from "../WorldKnowledge";

export const OBJECT_SELLER_CELL_SIZE = 35;

enum OBJECT {
    SOFA,
    DESK,
    DISPENSER,
}

export class ObjectSeller {
    private sellerButtons: SellerButton[];
    private worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge) {
        this.sellerButtons = [];
        this.worldKnowledge = worldKnowledge;
        ObjectSeller.objectProperties().forEach((objectProperties: {type: OBJECT, class: string, sprite: string}) => {
            this.sellerButtons.push(new SellerButton(
                objectProperties.type,
                objectProperties.class,
                objectProperties.sprite
            ));
        });
    }

    create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
        let i = 0;
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.create(game, interfaceGroup, i);
            i++;
        });
    }

    update() {
        this.sellerButtons.forEach((sellerButton) => {
            sellerButton.updateCount(this.getCount(sellerButton.getKlass()))
        })
    }

    static objectProperties(): {type: OBJECT, class: Object, sprite: string}[] {
        let result = [];
        result.push({
            type: OBJECT.SOFA,
            class: 'Sofa',
            sprite: 'sofa'
        });
        result.push({
            type: OBJECT.DESK,
            class: 'Desk',
            sprite: 'desk'
        });
        result.push({
            type: OBJECT.DISPENSER,
            class: 'Dispenser',
            sprite: 'dispenser'
        });

        return result;
    }

    private getCount(klass: string): number {
        return this.worldKnowledge.getDepot().getCount(klass);
    }
}

class SellerButton {
    private type: OBJECT;
    private klass: string;
    private sprite: string;
    private counter: Phaser.Text;

    constructor(type: OBJECT, klass: string, sprite: string) {
        this.type = type;
        this.klass = klass;
        this.sprite = sprite;
    }

    create(game: Phaser.Game, interfaceGroup: Phaser.Group, index: number) {
        const left = CAMERA_WIDTH_PIXELS - INTERFACE_WIDTH;

        const seller = game.add.sprite(left + OBJECT_SELLER_CELL_SIZE / 2, 10 + (index + 1) * OBJECT_SELLER_CELL_SIZE - OBJECT_SELLER_CELL_SIZE / 2, this.sprite);
        seller.anchor.set(0.5, 0.5);
        interfaceGroup.add(seller);

        const circle = game.add.graphics(left, index * OBJECT_SELLER_CELL_SIZE + 10, interfaceGroup);
        circle.beginFill(0xff0000);
        circle.drawCircle(OBJECT_SELLER_CELL_SIZE, 0, 10);
        interfaceGroup.add(circle);

        this.counter = game.add.text(left + OBJECT_SELLER_CELL_SIZE - 4, index * OBJECT_SELLER_CELL_SIZE + 10 - 6, '', {
            align: 'center',
            fill: "#ffffff",
            font: '16px 000webfont'
        }, interfaceGroup);
        interfaceGroup.add(this.counter);
        this.updateCount(0);
    }

    getKlass(): string {
        return this.klass;
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
}
