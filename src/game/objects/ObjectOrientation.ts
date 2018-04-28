import {DIRECTION} from "../Direction";

export const DIRECTION_LOOP: DIRECTION[] = [DIRECTION.RIGHT, DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.TOP];

export class ObjectOrientation {
    static isLeftOriented(direction: DIRECTION) {
        return [DIRECTION.BOTTOM, DIRECTION.LEFT].indexOf(direction) > -1;
    }

    static getNextOrientation(direction: DIRECTION, canBeTopOriented: boolean) {
        const index = DIRECTION_LOOP.indexOf(direction);
        return DIRECTION_LOOP[(index + 1) % (canBeTopOriented ? 4 : 2)];
    }

    static isTopOriented(direction: DIRECTION) {
        return [DIRECTION.LEFT, DIRECTION.TOP].indexOf(direction) > -1;
    }
}