const SELECTED = '_selected';

export class ObjectSelector {
    static makeSelectable(sprites: (Phaser.Sprite|Phaser.TileSprite)[], method: any = () => {}) {
        sprites.forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.click, this, 0, sprites, method);
        });
    }

    static setSelected(sprite: Phaser.Sprite|Phaser.TileSprite, selected: boolean) {
        sprite.loadTexture(
            selected ?
                this.getSelectedKey(sprite.key) :
                this.getNonSelectedKey(sprite.key),
            sprite.frame,
            false
        );
    }

    static isSelected(tile) {
        return tile.key.indexOf(SELECTED) > -1;
    }

    private static click(sprite, _pointer, sprites, method: any = () => {}) {
        const isSelected = this.isSelected(sprite);
        sprites.forEach((sprite) => {
            this.setSelected(sprite, !isSelected);
        });
        method.call();
    }

    private static getNonSelectedKey(key) {
        return key.replace(SELECTED, '');
    }

    private static getSelectedKey(key) {
        if (key.indexOf(SELECTED) > -1) {
            return key;
        }

        return key + SELECTED;
    }
}
