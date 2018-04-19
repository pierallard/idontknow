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

    static getNeighbor(point: PIXI.Point, direction: DIRECTION): PIXI.Point {
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
            return DIRECTION.CURRENT;
        }
    }

    static isLeft(direction: DIRECTION): boolean {
        return direction === DIRECTION.LEFT || direction === DIRECTION.BOTTOM;
    }

    static isTop(direction: DIRECTION): boolean {
        return direction === DIRECTION.TOP || direction === DIRECTION.LEFT;
    }

    static getHorizontalMirror(direction: DIRECTION) {
        switch (direction) {
            case DIRECTION.TOP: return DIRECTION.LEFT;
            case DIRECTION.BOTTOM: return DIRECTION.RIGHT;
            case DIRECTION.LEFT: return DIRECTION.TOP;
            case DIRECTION.RIGHT: return DIRECTION.BOTTOM;
            case DIRECTION.CURRENT: return DIRECTION.CURRENT;
        }
    }

    static getDirectionStr(direction: DIRECTION): string {
        switch (direction) {
            case DIRECTION.TOP: return 'T';
            case DIRECTION.BOTTOM: return 'B';
            case DIRECTION.LEFT: return 'L';
            case DIRECTION.RIGHT: return 'R';
            case DIRECTION.CURRENT: return 'C';
        }
    }
}
