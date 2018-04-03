const GAP_X = -7;
const GAP_Y = 1;

const DEBUG = false;

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

    update(generalHumor: number, humors: number[]) {
        this.sprite.position.x = Math.ceil(this.parent.position.x + GAP_X);
        this.sprite.position.y = Math.ceil(this.parent.position.y + GAP_Y);
        this.sprite.clear();
        if (!DEBUG) {
            humors = [generalHumor];
        }
        for (let i = 0; i < humors.length; i++) {
            this.sprite.moveTo(0, i * 2);
            if (humors[i] < 0.1) {
                this.sprite.lineStyle(2, 0xff004d);
            } else if (humors[i] < 0.5) {
                this.sprite.lineStyle(2, 0xfca203);
            } else {
                this.sprite.lineStyle(2, 0x00de2d);
            }
            this.sprite.lineTo(humors[i] * 15 + 1,   i * 2);
        }
    }
}