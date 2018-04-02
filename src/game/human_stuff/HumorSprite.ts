const GAP_X = -9;
const GAP_Y = -28;

export class HumorSprite {
    private sprite: Phaser.Graphics;
    private parent: Phaser.TileSprite;

    constructor() {
    }

    create(humanSprite: Phaser.TileSprite, game: Phaser.Game, group: Phaser.Group) {
        this.parent = humanSprite;
        this.sprite = game.add.graphics(this.parent.position.x, this.parent.position.y, group);
        group.add(this.sprite);
    }

    update(generalHumor: number) {
        this.sprite.position.x = Math.ceil(this.parent.position.x + GAP_X);
        this.sprite.position.y = Math.ceil(this.parent.position.y + GAP_Y);
        this.sprite.clear();
        this.sprite.moveTo(0, 0);
        if (generalHumor < 0.1) {
            this.sprite.lineStyle(2, 0xff004d);
        } else if (generalHumor < 0.5) {
            this.sprite.lineStyle(2, 0xfca203);
        } else {
            this.sprite.lineStyle(2, 0x00de2d);
        }
        this.sprite.lineTo(generalHumor * 15, 0);
    }
}