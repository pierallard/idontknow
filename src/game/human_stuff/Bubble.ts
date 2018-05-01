export abstract class Bubble {
    private sprite: Phaser.Sprite;
    private parent: Phaser.TileSprite;
    protected imageSprite: Phaser.Sprite;
    protected game: Phaser.Game;

    protected abstract getSpriteFrame(): number;
    protected abstract getImageSpriteKey(): string;

    create(humanSprite: Phaser.TileSprite, game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.parent = humanSprite;
        this.sprite = game.add.sprite(
            this.parent.position.x,
            this.parent.position.y,
            'bubble',
            this.getSpriteFrame(),
            group
        );
        this.sprite.anchor.set(0.99, 37/this.sprite.height);
        group.add(this.sprite);

        this.imageSprite = game.add.sprite(
            this.parent.position.x,
            this.parent.position.y,
            this.getImageSpriteKey(),
            0,
            group
        );
        this.imageSprite.anchor.set(1.15, 76/this.sprite.height);
        group.add(this.imageSprite);

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
}
