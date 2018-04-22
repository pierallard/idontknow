import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";

export class ObjectInfo {
    private name: string;
    private spriteInfos: SpriteInfo[];
    private price: Price;

    constructor(
        name: string,
        spriteInfos: SpriteInfo[],
        price: Price
    ) {
        this.name = name;
        this.spriteInfos = spriteInfos;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(): SpriteInfo[] {
        return this.spriteInfos;
    }

    getSpriteInfo(objectOrder: number): SpriteInfo {
        return this.spriteInfos[objectOrder];
    }

    getEntryPoints(leftOriented: boolean, objectNumber: number): DIRECTION[] {
        return this.spriteInfos[objectNumber].getEntryPoints(leftOriented);
    }

    getPositionGapOfSubObject(leftOriented: boolean, subObjectNumber: number): PIXI.Point {
        return this.spriteInfos[subObjectNumber].getPositionGapFromOrigin(leftOriented);
    }

    isSellable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }

    getCellGaps(leftOriented: boolean): PIXI.Point[] {
        let result = [];
        this.spriteInfos.forEach((spriteInfo) => {
            const newGap = spriteInfo.getPositionGapFromOrigin(leftOriented);
            let found = false;
            result.forEach((previousGap) => {
                found = found || (previousGap.x === newGap.x && previousGap.y === newGap.y);
            });
            if (!found) {
                result.push(newGap);
            }
        });

        return result;
    }

    getEntryCells(origin: PIXI.Point, leftOriented: boolean): PIXI.Point[] {
        let result = [];
        this.spriteInfos.forEach((spriteInfo) => {
            spriteInfo.getEntryPoints(leftOriented).forEach((entryPoint) => {
                const gap = spriteInfo.getPositionGapFromOrigin(leftOriented);
                const spriteCell = new PIXI.Point(
                    origin.x + gap.x,
                    origin.y + gap.y
                );
                result.push(Direction.getNeighbor(spriteCell, entryPoint));
            });
        });

        return result;
    }
}
