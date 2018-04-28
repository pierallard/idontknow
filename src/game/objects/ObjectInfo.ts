import {SpriteInfo} from "./SpriteInfo";
import {Direction, DIRECTION} from "../Direction";
import {Price} from "./Price";
import {ObjectOrientation} from "./ObjectOrientation";

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

    getSpriteInfos(orientation: DIRECTION) {
        return ObjectOrientation.isTopOriented(orientation)
            ? this.topOrientedSpriteInfos
            : this.bottomOrientedSpriteInfos;
    }

    getSpriteInfo(orientation: DIRECTION, objectOrder: number): SpriteInfo {
        return this.getSpriteInfos(orientation)[objectOrder];
    }

    getEntryPoints(orientation: DIRECTION, objectNumber: number): DIRECTION[] {
        return this
            .getSpriteInfo(orientation, objectNumber)
            .getEntryPoints(ObjectOrientation.isLeftOriented(orientation));
    }

    getPositionGapOfSubObject(orientation: DIRECTION, subObjectNumber: number): PIXI.Point {
        return this
            .getSpriteInfo(orientation, subObjectNumber)
            .getPositionGapFromOrigin(ObjectOrientation.isLeftOriented(orientation));
    }

    isSellable(remainingMoney: Price): boolean {
        return remainingMoney.isGreaterThan(this.price);
    }

    getPrice(): Price {
        return this.price;
    }

    getCellGaps(orientation: DIRECTION): PIXI.Point[] {
        let result = [];
        this.getSpriteInfos(orientation).forEach((spriteInfo) => {
            const newGap = spriteInfo.getPositionGapFromOrigin(ObjectOrientation.isLeftOriented(orientation));
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

    getEntryCells(origin: PIXI.Point, orientation: DIRECTION): PIXI.Point[] {
        let result = [];
        this.getSpriteInfos(orientation).forEach((spriteInfo) => {
            spriteInfo.getEntryPoints(ObjectOrientation.isLeftOriented(orientation)).forEach((entryPoint) => {
                const gap = spriteInfo.getPositionGapFromOrigin(ObjectOrientation.isLeftOriented(orientation));
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
