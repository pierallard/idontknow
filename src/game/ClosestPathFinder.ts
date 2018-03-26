import {World} from "./World";

enum DIRECTION {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export class ClosestPathFinder {
    private finders: Object;

    constructor(game: Phaser.Game, world: World) {
        this.finders = {};
        const grid = world.getGround().getGrid();
        const acceptables = world.getGround().getAcceptables();
        ClosestPathFinder.directions().forEach((direction: DIRECTION) => {
            this.finders[direction] = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
            this.finders[direction].setGrid(grid, acceptables);
        });
    }

    getPath(originCell: PIXI.Point, goalCell: PIXI.Point, callback: Function) {
        let results = {};

        ClosestPathFinder.directions().forEach((direction: DIRECTION) => {
            this.finders[direction].setCallbackFunction((path: ({x: number, y: number}[])) => {
                results[direction] = path;
                if (Object.keys(results).length >= 4) {
                    this.doIt(results, callback);
                }
            });

            try {
                const gappedPoint = ClosestPathFinder.getGap(new PIXI.Point(goalCell.x, goalCell.y), direction);
                this.finders[direction].preparePathCalculation([originCell.x, originCell.y], [gappedPoint.x, gappedPoint.y]);
                this.finders[direction].calculatePath();
            } catch (e) {
                results[direction] = null;
                if (Object.keys(results).length >= 4) {
                    this.doIt(results, callback);
                }
            }
        });
    }

    private doIt(results, callback) {
        let bestPath = null;
        for (let i = 0; i < Object.keys(results).length; i++) {
            const path = results[Object.keys(results)[i]];
            if (bestPath === null || (path !== null && bestPath.length > path.length)) {
                bestPath = path;
            }
        }
        if (bestPath) {
            console.log('Path found !');
            const lastCell = bestPath[bestPath.length - 1];
            callback.call(this, new PIXI.Point(lastCell.x, lastCell.y));
        } else {
            console.log('No path found');
        }
    }

    private static directions(): DIRECTION[] {
        return [
            DIRECTION.TOP,
            DIRECTION.BOTTOM,
            DIRECTION.LEFT,
            DIRECTION.RIGHT
        ];
    }

    private static getGap(point: PIXI.Point, direction: DIRECTION): PIXI.Point {
        switch (direction) {
            case DIRECTION.TOP: return new PIXI.Point(point.x, point.y + 1);
            case DIRECTION.BOTTOM: return new PIXI.Point(point.x, point.y - 1);
            case DIRECTION.LEFT: return new PIXI.Point(point.x + 1, point.y);
            case DIRECTION.RIGHT: return new PIXI.Point(point.x - 1, point.y);
        }
    }
}
