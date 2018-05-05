import {COLOR} from "../Pico8Colors";

const GAP_X = -7;
const GAP_Y = 1;

const DEBUG = false;

export class MoodSprite {
    private sprite: Phaser.Graphics;
    private parent: Phaser.TileSprite;

    create(humanSprite: Phaser.TileSprite, game: Phaser.Game, group: Phaser.Group) {
        this.parent = humanSprite;
        this.sprite = game.add.graphics(this.parent.position.x, this.parent.position.y, group);
        group.add(this.sprite);
    }

    update(generalMood: number, moods: number[]) {
        this.sprite.position.x = Math.ceil(this.parent.position.x + GAP_X);
        this.sprite.position.y = Math.ceil(this.parent.position.y + GAP_Y);
        this.sprite.clear();
        if (!DEBUG) {
            moods = [generalMood];
        }
        for (let i = 0; i < moods.length; i++) {
            this.sprite.moveTo(0, i * 2);
            this.sprite.lineStyle(2, MoodSprite.getColor(moods[i]));
            this.sprite.lineTo(Math.floor(moods[i] * 15 + 1),   i * 2);
        }
    }

    static getColor(mood: number): COLOR {
        if (mood < 0.1) {
            return COLOR.RED;
        } else if (mood < 0.5) {
            return COLOR.ORANGE;
        } else {
            return COLOR.LIGHT_GREEN;
        }
    }
}