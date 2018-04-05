const IMAGE_COUNT = 3;

export class TalkBubble {
    private sprite: Phaser.Sprite;
    private parent: Phaser.TileSprite;
    private imageSprite: Phaser.Sprite;
    private game: Phaser.Game;

    create(humanSprite: Phaser.TileSprite, game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.parent = humanSprite;
        this.sprite = game.add.sprite(
            this.parent.position.x,
            this.parent.position.y,
            'bubble',
            0,
            group
        );
        this.sprite.anchor.set(1, 37/this.sprite.height);
        group.add(this.sprite);

        this.imageSprite = game.add.sprite(
            this.parent.position.x,
            this.parent.position.y,
            'bubble_images',
            0,
            group
        );
        this.imageSprite.anchor.set(1.2, 76/this.sprite.height);
        group.add(this.imageSprite);

        this.switchImage();
        this.hide();
    }

    show() {
        this.sprite.alpha = 1;
        this.imageSprite.alpha = 1;
    }

    hide() {
        this.sprite.alpha = 0;
        this.imageSprite.alpha = 0;
    }

    update() {
        this.sprite.position = this.parent.position;
        this.sprite.scale.x = this.parent.scale.x;
        this.imageSprite.position = this.parent.position;
        this.imageSprite.scale.x = this.parent.scale.x;
    }

    static getRandomFrame() {
        return Math.floor(Math.random() * IMAGE_COUNT);
    }

    private switchImage() {
        this.imageSprite.loadTexture(this.imageSprite.key, TalkBubble.getRandomFrame());
        this.game.time.events.add(Phaser.Math.random(2, 4) * Phaser.Timer.SECOND, this.switchImage, this)
    }
}
