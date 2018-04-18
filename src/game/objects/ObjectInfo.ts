import {SpriteInfo} from "./SpriteInfo";
import {DIRECTION} from "../Direction";
import {Price} from "./Price";

export class ObjectInfo {
    private name: string;
    private sprites: SpriteInfo[];
    private price: Price;

    constructor(
        name: string,
        spriteInfos: SpriteInfo[],
        price: Price
    ) {
        this.name = name;
        this.sprites = spriteInfos;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(): SpriteInfo[] {
        return this.sprites;
    }

    getSpriteInfo(objectOrder: number): SpriteInfo {
        return this.sprites[objectOrder];
    }

    getEntryPoints(leftOriented: boolean, objectNumber: number): DIRECTION[] {
        return this.sprites[objectNumber].getEntryPoints(leftOriented);
    }

    isSellable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }

    getPositionGapOfSubObject(subObjectNumber: number): PIXI.Point {
        return this.sprites[subObjectNumber].getPositionGapFromOrigin();
    }

    getCellGaps(): PIXI.Point[] {
        let result = [];
        this.sprites.forEach((sprite) => {
            const newGap = sprite.getPositionGapFromOrigin();
            let found = false;
            result.forEach((previousGap) => {
                found = found || (previousGap.x === newGap.y && previousGap.y === newGap.y);
            });
            if (!found) {
                result.push(newGap);
            }
        });

        return result;
    }
}
