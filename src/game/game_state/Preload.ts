
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
        this.game.load.spritesheet('walk', 'assets/walk.png', 24, 24);
        this.game.load.spritesheet('default', 'assets/default.png', 24, 24);
        this.game.load.spritesheet('walk_reverse', 'assets/walk_reverse.png', 24, 24);
        this.game.load.spritesheet('default_reverse', 'assets/default_reverse.png', 24, 24);
    }

    private loadFonts() {
    }
}
