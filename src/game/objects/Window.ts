import {Wall} from "./Wall";

export class Window extends Wall {
    create(game: Phaser.Game,
           group: Phaser.Group,
           hasWallLeft: boolean,
           hasWallTop: boolean,
           hasWallRight: boolean,
           hasWallBottom: boolean
    ) {
        super.create(game, group, hasWallLeft, hasWallTop, hasWallRight, hasWallBottom);

        if (hasWallLeft) {
            this.sprite.loadTexture('wall', 16);
        } else {
            this.sprite.loadTexture('wall', 17);
        }
    }
}