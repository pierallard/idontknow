import {SpriteInfo} from "./SpriteInfo";
import {DIRECTION, Direction} from "../Direction";
import {Price} from "./Price";

export class ObjectInfo {
    private name: string;
    private sprites: SpriteInfo[];
    private entryPoints: DIRECTION[];
    private price: Price;

    constructor(name: string, spriteInfos: SpriteInfo[], entryPoints: DIRECTION[], price: Price) {
        this.name = name;
        this.sprites = spriteInfos;
        this.entryPoints = entryPoints;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(): SpriteInfo[] {
        return this.sprites;
    }

    getEntryPoints(leftOriented: boolean): DIRECTION[] {
        if (!leftOriented) {
            return this.entryPoints;
        } else {
            return this.entryPoints.map((entryPoint) => {
                return Direction.getHorizontalMirror(entryPoint);
            });
        }
    }

    isSellable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }
}