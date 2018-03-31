import {ObjectInterface} from "./ObjectInterface";

export interface MovableObjectInterface extends ObjectInterface {
    getSprites(): Phaser.Sprite[];
    getPosition(): PIXI.Point;
    tryToMove(point: PIXI.Point): void;
}
