import {Bubble} from "./Bubble";

export enum RAGE_IMAGE {
    COFFEE = 0,
    LAPTOP = 1,
    SLEEP = 2,
    TABLE = 3,
    PATH = 4,
}

export class ThoughtBubble extends Bubble {
    protected getSpriteFrame(): number {
        return 1;
    }

    protected getImageSpriteKey(): string {
        return 'bubble_images_angry';
    }

    showRage(rageImage: RAGE_IMAGE) {
        this.imageSprite.loadTexture(this.getImageSpriteKey(), rageImage);
        super.show();
    }
}
