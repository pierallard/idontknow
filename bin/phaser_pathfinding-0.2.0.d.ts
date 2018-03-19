declare module Phaser {
    module Plugin {
        class PathFinderPlugin extends Phaser.Plugin {
            constructor();

            setGrid(grid: {index: number}[][], walkables: number[], iterationsPerCount?:number): void;
            preparePathCalculation(from: number[], to: number[]): void;
            calculatePath(): void;
            setCallbackFunction(param: (path: ({x: number, y: number}[])) => void): void;
            setTileCost(tileType: number, cost: number): void;
        }
    }
}
