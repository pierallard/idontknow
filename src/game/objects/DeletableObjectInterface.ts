import {InteractiveObjectInterface} from "./InteractiveObjectInterface";

export interface DeletableObjectInterface extends InteractiveObjectInterface {
    getSprites(): Phaser.Sprite[];
    remove(): void;
}
