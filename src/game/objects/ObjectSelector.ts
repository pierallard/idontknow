export const SELECTED = '_selected';

export class ObjectSelector {
    static makeSelectable(
        sprites: (Phaser.Sprite|Phaser.TileSprite)[],
        fallbackSelect: any = () => {},
        fallbackUnselect: any = () => {}
    ) {
        sprites.forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.click, this, 0, sprites, fallbackSelect, fallbackUnselect);
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

    static click(sprite, _pointer, sprites, fallbackSelect: any = () => {},  fallbackUnselect: any = () => {}) {
        const isSelected = this.isSelected(sprite);
        sprites.forEach((sprite) => {
            this.setSelected(sprite, !isSelected);
        });
        if (isSelected) {
            fallbackUnselect.call();
        } else {
            fallbackSelect.call();
        }
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
