import {Bubble} from "./Bubble";

export class TalkBubble extends Bubble {
    private event: Phaser.TimerEvent;

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

    getRandomFrame() {
        const imageCount = this.imageSprite.texture.baseTexture.width / 9;
        return Math.floor(Math.random() * imageCount);
    }

    private switchImage() {
        this.imageSprite.loadTexture(this.imageSprite.key, this.getRandomFrame());
        this.event = this.game.time.events.add(Phaser.Math.random(2, 4) * Phaser.Timer.SECOND, this.switchImage, this)
    }

    hide() {
        console.log(this.game.time.events.length);
        console.log(
            this.game.time.events.remove(this.event)
        );
        console.log(this.game.time.events.length);
        super.hide();
    }

    show() {
        this.switchImage();
        super.show();
    }
}
