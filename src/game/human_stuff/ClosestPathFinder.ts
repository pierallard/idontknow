import {WorldKnowledge} from "../WorldKnowledge";
import {Direction, DIRECTION} from "../Direction";

export class ClosestPathFinder {
    private finders: {[index: number]: Phaser.Plugin.PathFinderPlugin};
    private worldKnowledge: WorldKnowledge;
    private reseted: boolean;

    constructor(game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        this.finders = {};
        this.worldKnowledge = worldKnowledge;
        Direction.neighborDirections().concat([DIRECTION.CURRENT]).forEach((direction: DIRECTION) => {
            this.finders[direction] = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        });
        this.reseted = true;
    }

    getNeighborPath(originCell: PIXI.Point, goalCell: PIXI.Point, entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]): PIXI.Point[] {
        return this.getPathInner(originCell, goalCell, entries);
    }

    getPath(originCell: PIXI.Point, goalCell: PIXI.Point): PIXI.Point[] {
        return this.getPathInner(originCell, goalCell, [DIRECTION.CURRENT]);
    }

    private getPathInner(originCell: PIXI.Point, goalCell: PIXI.Point, directions: DIRECTION[]): PIXI.Point[] {
        this.initialize();
        let results = {};
        for (let i = 0; i < directions.length; i++) {
            const direction = directions[i];
            try {
                const gappedCell = Direction.getNeighbor(goalCell, direction);
                if (originCell.x === gappedCell.x && originCell.y === gappedCell.y) {
                    results[direction] = [];
                    if (Object.keys(results).length >= directions.length) {
                        return ClosestPathFinder.getClosest(results);
                    }
                }

                this.finders[direction].setCallbackFunction((path: ({ x: number, y: number }[])) => {
                    if (path) {
                        results[direction] = [];
                        for (let i = 1, ilen = path.length; i < ilen; i++) {
                            results[direction].push(new PIXI.Point(path[i].x, path[i].y));
                        }
                    } else {
                        results[direction] = null;
                    }

                });

                this.finders[direction].preparePathCalculation([originCell.x, originCell.y], [gappedCell.x, gappedCell.y]);
                this.finders[direction].calculatePath();

                let tries = 1000;
                while (tries > 0) {
                    if (direction in results) {
                        if (Object.keys(results).length >= directions.length) {
                            return ClosestPathFinder.getClosest(results);
                        }
                        tries = 0;
                    }
                    tries--;
                }
                if (!(direction in results)) {
                    results[direction] = null;
                    if (Object.keys(results).length >= directions.length) {
                        return ClosestPathFinder.getClosest(results);
                    }
                }
            } catch (e) {
                results[direction] = null;
                if (Object.keys(results).length >= directions.length) {
                    return ClosestPathFinder.getClosest(results);
                }
            }
        }

        return null;
    }

    private static getClosest(results): PIXI.Point[] {
        let bestPath = null;
        for (let i = 0; i < Object.keys(results).length; i++) {
            const path = results[Object.keys(results)[i]];
            if (bestPath === null || (path !== null && bestPath.length > path.length)) {
                bestPath = path;
            }
        }
        if (bestPath) {
            return bestPath;
        } else {
            return null;
        }
    }

    reset() {
        this.reseted = true;
    }

    private initialize() {
        if (this.reseted === true) {
            const grid = this.worldKnowledge.getGrid();
            const acceptables = this.worldKnowledge.getAcceptables();
            Direction.neighborDirections().concat([DIRECTION.CURRENT]).forEach((direction: DIRECTION) => {
                this.finders[direction].setGrid(grid, acceptables);
            });
            this.reseted = false;
        }
    }
}
