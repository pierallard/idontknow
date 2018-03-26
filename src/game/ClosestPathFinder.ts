import {World} from "./World";

export class ClosestPathFinder {
    private topFinder: Phaser.Plugin.PathFinderPlugin;
    private bottomFinder: Phaser.Plugin.PathFinderPlugin;
    private leftFinder: Phaser.Plugin.PathFinderPlugin;
    private rightFinder: Phaser.Plugin.PathFinderPlugin;

    constructor(game: Phaser.Game, world: World) {
        this.topFinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.bottomFinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.leftFinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.rightFinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);

        this.topFinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());
        this.bottomFinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());
        this.leftFinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());
        this.rightFinder.setGrid(world.getGround().getGrid(), world.getGround().getAcceptables());
    }

    getPath(originCell: PIXI.Point, goalCell: PIXI.Point, callback, referee) {
        let results = {};

        this.topFinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            results['top'] = path;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        });
        this.bottomFinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            results['bottom'] = path;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        });
        this.leftFinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            results['left'] = path;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        });
        this.rightFinder.setCallbackFunction((path: ({x: number, y: number}[])) => {
            results['right'] = path;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        });

        try {
            this.topFinder.preparePathCalculation([originCell.x, originCell.y], [goalCell.x, goalCell.y + 1]);
            this.topFinder.calculatePath();
        } catch (e) {
            results['top'] = null;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        }

        try {
            this.bottomFinder.preparePathCalculation([originCell.x, originCell.y], [goalCell.x, goalCell.y - 1]);
            this.bottomFinder.calculatePath();
        } catch (e) {
            results['bottom'] = null;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        }

        try {
            this.leftFinder.preparePathCalculation([originCell.x, originCell.y], [goalCell.x + 1, goalCell.y]);
            this.leftFinder.calculatePath();
        } catch (e) {
            results['left'] = null;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        }

        try {
            this.rightFinder.preparePathCalculation([originCell.x, originCell.y], [goalCell.x - 1, goalCell.y]);
            this.rightFinder.calculatePath();
        } catch (e) {
            results['right'] = null;
            if (Object.keys(results).length >= 4) {
                this.doIt(results, callback, referee);
            }
        }
    }

    private doIt(results, callback, referee) {
        let bestPath = null;
        for (let i = 0; i < Object.keys(results).length; i++) {
            const path = results[Object.keys(results)[i]];
            if (bestPath === null || (path !== null && bestPath.length > path.length)) {
                bestPath = path;
            }
        }
        if (bestPath) {
            const lastCell = bestPath[bestPath.length - 1];
            callback.call(this, new PIXI.Point(lastCell.x, lastCell.y));
        } else {
            console.log('No path found');
        }
    }
}
