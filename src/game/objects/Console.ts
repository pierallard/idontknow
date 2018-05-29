import {AbstractObject} from "./AbstractObject";
import {Direction, DIRECTION} from "../Direction";
import {WorldKnowledge} from "../WorldKnowledge";
import {FRAME_RATE} from "../human_stuff/HumanAnimationManager";
import {Point} from "../Point";

export class Console extends AbstractObject {
    private playersCount: number;
    private tvSprite: Phaser.Sprite;

    constructor(point: Point, worldKnowledge: WorldKnowledge, orientation: DIRECTION) {
        super(point, worldKnowledge, orientation);
        this.playersCount = 0;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        super.create(game, groups);
        this.tvSprite = this.sprites[Direction.isTop(this.orientation) ? 0 : 2];
        if (Direction.isTop(this.orientation)) {
            this.tvSprite.animations.add('play', [1, 2, 3]);
        }
    }

    addPlayer() {
        this.playersCount++;
        if (this.playersCount === 1) {
            this.runAnimation();
        }
    }

    removePlayer() {
        this.playersCount--;
        if (this.playersCount === 0) {
            this.stopAnimation();
        }
    }

    private runAnimation() {
        if (Direction.isTop(this.orientation)) {
            this.tvSprite.animations.play('play', FRAME_RATE, true);
        } else {
            this.tvSprite.loadTexture('tv', 1);
        }
    }

    private stopAnimation() {
        if (Direction.isTop(this.orientation)) {
            this.tvSprite.animations.stop('play');
            this.tvSprite.loadTexture('tv_reverse', 0);
        } else {
            this.tvSprite.loadTexture('tv', 0);
        }
    }
}
