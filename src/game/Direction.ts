export enum DIRECTION {
    CURRENT,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export class Direction {
    static neighborDirections(): DIRECTION[] {
        return [
            DIRECTION.TOP,
            DIRECTION.BOTTOM,
            DIRECTION.LEFT,
            DIRECTION.RIGHT
        ];
    }

    static getGap(point: PIXI.Point, direction: DIRECTION): PIXI.Point {
        switch (direction) {
            case DIRECTION.TOP: return new PIXI.Point(point.x, point.y + 1);
            case DIRECTION.BOTTOM: return new PIXI.Point(point.x, point.y - 1);
            case DIRECTION.LEFT: return new PIXI.Point(point.x + 1, point.y);
            case DIRECTION.RIGHT: return new PIXI.Point(point.x - 1, point.y);
            case DIRECTION.CURRENT: return point;
        }
    }

    static getNeighborDirection(originPoint: PIXI.Point, goalPoint: PIXI.Point): DIRECTION {
        if (goalPoint.x > originPoint.x) {
            return DIRECTION.LEFT;
        } else if (goalPoint.x < originPoint.x) {
            return DIRECTION.RIGHT;
        } else if (goalPoint.y > originPoint.y) {
            return DIRECTION.TOP;
        } else if (goalPoint.y < originPoint.y) {
            return DIRECTION.BOTTOM;
        } else {
            debugger;
        }
    }

    static isLeft(direction: DIRECTION): boolean {
        return direction === DIRECTION.LEFT || direction === DIRECTION.BOTTOM;
    }

    static isTop(direction: DIRECTION): boolean {
        return direction === DIRECTION.TOP || direction === DIRECTION.LEFT;
    }
}