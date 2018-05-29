import {GRID_FLOOR, WorldKnowledge} from "../WorldKnowledge";
import {Direction, DIRECTION} from "../Direction";
import {Point} from "../Point";

export class ClosestPathFinder {
    private finders: {[floor: number]: {[direction: number]: Phaser.Plugin.PathFinderPlugin}};
    private worldKnowledge: WorldKnowledge;
    private reseted: boolean;

    constructor(game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        this.finders = {};
        this.worldKnowledge = worldKnowledge;
        for (let i = 0; i < GRID_FLOOR; i++) {
            this.finders[i] = [];
            Direction.neighborDirections().concat([DIRECTION.CURRENT]).forEach((direction: DIRECTION) => {
                this.finders[i][direction] = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
            });
        }
        this.reseted = true;
    }

    getNeighborPath(originCell: Point, goalCell: Point, entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]): Point[] {
        return this.getPathInner(originCell, goalCell, entries);
    }

    getPath(originCell: Point, goalCell: Point): Point[] {
        return this.getPathInner(originCell, goalCell, [DIRECTION.CURRENT]);
    }

    private getPathInner(originCell: Point, goalCell: Point, directions: DIRECTION[]): Point[] {
        if (originCell.z === goalCell.z) {
            const floor = originCell.z;
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

                    this.finders[floor][direction].setCallbackFunction((path: ({ x: number, y: number }[])) => {
                        if (path) {
                            results[direction] = [];
                            for (let i = 1, ilen = path.length; i < ilen; i++) {
                                results[direction].push(new Point(path[i].x, path[i].y, floor));
                            }
                        } else {
                            results[direction] = null;
                        }

                    });

                    this.finders[floor][direction].preparePathCalculation([originCell.x, originCell.y], [gappedCell.x, gappedCell.y]);
                    this.finders[floor][direction].calculatePath();

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
        }

        return null;
    }

    private static getClosest(results): Point[] {
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
            for (let i = 0; i < GRID_FLOOR; i++) {
                const grid = this.worldKnowledge.getGrid(i);
                const acceptables = this.worldKnowledge.getAcceptables(i);
                Direction.neighborDirections().concat([DIRECTION.CURRENT]).forEach((direction: DIRECTION) => {
                    this.finders[i][direction].setGrid(grid, acceptables);
                });

            }
            this.reseted = false;
        }
    }
}
