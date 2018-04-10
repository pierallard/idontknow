import {ObjectInterface} from "./ObjectInterface";

export interface DeletableObjectInterface extends ObjectInterface {
    getSprites(): Phaser.Sprite[];
    remove(): void;
}
