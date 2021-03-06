import {HUMAN_SPRITE_COLORS, HUMAN_SPRITE_VARIATIONS} from "../human_stuff/Employee";
import {SELECTED} from "../objects/ObjectSelector";

export default class Preload extends Phaser.State {
    public preload () {
        this.loadAudio();
        this.loadLevels();
        this.loadTileMaps();
        this.loadGameImages();
        this.loadFonts();
    }

    public create () {
        this.game.state.start('Play');
    }

    private loadAudio() {
    }

    private loadLevels() {
    }

    private loadTileMaps() {
    }

    private loadGameImages() {
        HUMAN_SPRITE_VARIATIONS.forEach((humanSprite) => {
            HUMAN_SPRITE_COLORS.forEach((humanColor) => {
                const key = humanSprite + '_' + humanColor;
                const selectedKey = key + SELECTED;
                this.game.load.spritesheet(key, 'assets/' + key + '.png', 24, 25);
                this.game.load.spritesheet(selectedKey, 'assets/' + selectedKey + '.png', 24, 25);
            })
        });
        this.game.load.spritesheet('casedefault', 'assets/casedefault.png', 40, 19);
        this.game.load.spritesheet('ambiance', 'assets/ambiance.png', 40, 19);
        this.game.load.spritesheet('woodcell', 'assets/woodcell.png', 40, 19);
        this.game.load.spritesheet('case_floortile', 'assets/case_floortile.png', 40, 19);
        this.game.load.spritesheet('chair', 'assets/chair.png', 40, 40);
        this.game.load.spritesheet('chair_reverse', 'assets/chair_reverse.png', 40, 40);
        this.game.load.spritesheet('chair_selected', 'assets/chair_selected.png', 40, 40);
        this.game.load.spritesheet('chair2', 'assets/chair2.png', 14, 17);
        this.game.load.spritesheet('chair2_reverse', 'assets/chair2_reverse.png', 14, 17);
        this.game.load.spritesheet('table', 'assets/table.png', 42, 40);
        this.game.load.spritesheet('table_reverse', 'assets/table_reverse.png', 42, 40);
        this.game.load.spritesheet('desk', 'assets/desk.png', 40, 40);
        this.game.load.spritesheet('desk_reverse', 'assets/desk_reverse.png', 40, 40);
        this.game.load.spritesheet('desk_selected', 'assets/desk_selected.png', 40, 40);
        this.game.load.spritesheet('wall', 'assets/wall.png', 40, 60);
        this.game.load.spritesheet('sofa', 'assets/sofa.png', 8, 6);
        this.game.load.spritesheet('dispenser', 'assets/dispenser.png', 26, 35);
        this.game.load.spritesheet('dispenser_reverse', 'assets/dispenser_reverse.png', 26, 35);
        this.game.load.spritesheet('dispenser_selected', 'assets/dispenser_selected.png', 26, 35);
        this.game.load.spritesheet('sofa_selected', 'assets/sofa_selected.png', 8, 6);
        this.game.load.spritesheet('bubble', 'assets/bubble.png', 13, 15);
        this.game.load.spritesheet('bubble_images', 'assets/bubble_images.png', 9, 7);
        this.game.load.spritesheet('bubble_images_angry', 'assets/bubble_images_angry.png', 9, 7);
        this.game.load.spritesheet('forbidden', 'assets/forbidden.png', 12, 12);
        this.game.load.spritesheet('buy_button', 'assets/buy_button.png', 14, 14);
        this.game.load.spritesheet('interfacetabs', 'assets/interfacetabs.png', 28, 12);
        this.game.load.spritesheet('couch_part1', 'assets/couch_part1.png', 60, 39);
        this.game.load.spritesheet('couch_part2', 'assets/couch_part2.png', 60, 39);
        this.game.load.spritesheet('couch_reverse_part1', 'assets/couch_reverse_part1.png', 60, 39);
        this.game.load.spritesheet('couch_reverse_part2', 'assets/couch_reverse_part2.png', 60, 39);
        this.game.load.spritesheet('couch_reverse_cache', 'assets/couch_reverse_cache.png', 60, 39);
        this.game.load.spritesheet('coin', 'assets/coin.png', 7, 9);
        this.game.load.spritesheet('star', 'assets/star.png', 9, 9);
        this.game.load.spritesheet('tv_reverse', 'assets/tv_reverse.png', 24, 35);
        this.game.load.spritesheet('tv', 'assets/tv.png', 24, 35);
        this.game.load.spritesheet('info', 'assets/info.png', 12, 12);
        this.game.load.spritesheet('lamp', 'assets/lamp.png', 40, 50);
        this.game.load.spritesheet('lamp_reverse', 'assets/lamp_reverse.png', 40, 50);
        this.game.load.spritesheet('printer', 'assets/printer.png', 40, 35);
        this.game.load.spritesheet('printer_reverse', 'assets/printer_reverse.png', 40, 35);
        this.game.load.spritesheet('check', 'assets/check.png', 5, 5);
        this.game.load.spritesheet('bonzai', 'assets/bonzai.png', 40, 40);
    }

    private loadFonts() {
        this.game.load.bitmapFont('retro_computer', 'assets/font/font.png', 'assets/font/font.ftn');
    }
}
