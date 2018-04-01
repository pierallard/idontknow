import {ObjectInterface} from "./ObjectInterface";

export interface MovableObjectInterface extends ObjectInterface {
    getSprites(): Phaser.Sprite[];
    tryToMove(point: PIXI.Point): void;
}
