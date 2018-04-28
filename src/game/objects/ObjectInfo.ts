import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";

export class ObjectInfo {
    private name: string;
    private bottomOrientedSpriteInfos: SpriteInfo[];
    private topOrientedSpriteInfos: SpriteInfo[];
    private price: Price;

    constructor(
        name: string,
        bottomOrientedSpriteInfos: SpriteInfo[],
        topOrientedSpriteInfos: SpriteInfo[],
        price: Price
    ) {
        this.name = name;
        this.bottomOrientedSpriteInfos = bottomOrientedSpriteInfos;
        this.topOrientedSpriteInfos = topOrientedSpriteInfos;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(topOriented: boolean) {
        return topOriented ? this.topOrientedSpriteInfos : this.bottomOrientedSpriteInfos;
    }

    getSpriteInfo(objectOrder: number): SpriteInfo {
        return this.bottomOrientedSpriteInfos[objectOrder];
    }

    getEntryPoints(leftOriented: boolean, objectNumber: number): DIRECTION[] {
        return this.bottomOrientedSpriteInfos[objectNumber].getEntryPoints(leftOriented);
    }

    getPositionGapOfSubObject(leftOriented: boolean, subObjectNumber: number): PIXI.Point {
        return this.bottomOrientedSpriteInfos[subObjectNumber].getPositionGapFromOrigin(leftOriented);
    }

    isSellable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }

    getCellGaps(leftOriented: boolean): PIXI.Point[] {
        let result = [];
        this.bottomOrientedSpriteInfos.forEach((spriteInfo) => {
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
        this.bottomOrientedSpriteInfos.forEach((spriteInfo) => {
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

    canBeTopOriented() {
        return this.topOrientedSpriteInfos.length > 0;
    }
}
