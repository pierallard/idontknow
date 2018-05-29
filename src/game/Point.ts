export class Point {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    to2DPoint(): PIXI.Point {
        return new PIXI.Point(this.x, this.y);
    }

    equals(point: Point) {
        return this.x === point.x && this.y === point.y && this.z === point.z;
    }

    add(gap: PIXI.Point) {
        return new Point(
            this.x + gap.x,
            this.y + gap.y,
            this.z
        );
    }
}
