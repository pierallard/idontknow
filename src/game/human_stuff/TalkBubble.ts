import {Bubble} from "./Bubble";

const IMAGE_COUNT = 6;

export class TalkBubble extends Bubble {
    protected getImageSpriteKey(): string {
        return 'bubble_images';
    }

    protected getSpriteFrame(): number {
        return 0;
    }

    create(humanSprite: Phaser.TileSprite, game: Phaser.Game, group: Phaser.Group) {
        super.create(humanSprite, game, group);
        this.switchImage();
    }

    static getRandomFrame() {
        return Math.floor(Math.random() * IMAGE_COUNT);
    }

    private switchImage() {
        //this.imageSprite.loadTexture(this.imageSprite.key, TalkBubble.getRandomFrame());
        this.game.time.events.add(Phaser.Math.random(2, 4) * Phaser.Timer.SECOND, this.switchImage, this)
    }
}
