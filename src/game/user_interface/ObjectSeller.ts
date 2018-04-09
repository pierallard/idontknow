import {Sofa} from "../objects/Sofa";
import {Desk} from "../objects/Desk";
import {Dispenser} from "../objects/Dispenser";

export const OBJECT_SELLER_CELL_SIZE = 35;

enum OBJECT {
    SOFA,
    DESK,
    DISPENSER,
}

export class ObjectSeller {
    private left: number;

    constructor(left: number) {
        this.left = left;
    }

    create(game: Phaser.Game, interfaceGroup: Phaser.Group) {
        let y = OBJECT_SELLER_CELL_SIZE / 2;

        ObjectSeller.objectProperties().forEach((objectProperties: {type: OBJECT, class: Object, sprite: string}) => {
            const seller = game.add.sprite(this.left + OBJECT_SELLER_CELL_SIZE / 2, y, objectProperties.sprite);
            seller.anchor.set(0.5, 0.5);
            interfaceGroup.add(seller);
            y += OBJECT_SELLER_CELL_SIZE;
        });
    }

    static objectProperties(): {type: OBJECT, class: Object, sprite: string}[] {
        let result = [];
        result.push({
            type: OBJECT.SOFA,
            class: Sofa,
            sprite: 'sofa'
        });
        result.push({
            type: OBJECT.DESK,
            class: Desk,
            sprite: 'desk'
        });
        result.push({
            type: OBJECT.DISPENSER,
            class: Dispenser,
            sprite: 'dispenser'
        });

        return result;
    }
}