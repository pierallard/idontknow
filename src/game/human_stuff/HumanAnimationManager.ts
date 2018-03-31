const TOP_ORIENTED_ANIMATION = '_reverse';
const FRAME_RATE = 12;

export enum ANIMATION {
    FREEZE,
    WALK,
    SMOKE,
    SIT_DOWN,
    STAND_UP,
    TYPE,
    TALK,
}

export class HumanAnimationManager {
    humanTile: Phaser.TileSprite;

    create(humanTile: Phaser.TileSprite) {
        this.humanTile = humanTile;
        HumanAnimationManager.getAnimations().forEach((animation) => {
            if (HumanAnimationManager.hasTopOrientedVariation(animation)) {
                this.humanTile.animations.add(animation + '', HumanAnimationManager.getAnimationFrames(animation, false));
                this.humanTile.animations.add(animation + TOP_ORIENTED_ANIMATION, HumanAnimationManager.getAnimationFrames(animation, true));
            } else {
                this.humanTile.animations.add(animation + '', HumanAnimationManager.getAnimationFrames(animation));
            }
        });
    }

    private getAnimationName(animation: ANIMATION, isTop: boolean = null): string {
        if (isTop === null) {
            return this.getAnimationName(animation, this.humanTile.animations.name.endsWith(TOP_ORIENTED_ANIMATION));
        }

        return animation + (isTop ? TOP_ORIENTED_ANIMATION : '');
    }

    loadAnimation(animation: ANIMATION, isLeft: boolean = null, isTop: boolean = null) {
        switch (animation) {
            case ANIMATION.FREEZE:
            case ANIMATION.WALK:
                // Looped sided animation (bottom/top + left/right)
                const animationName = this.getAnimationName(animation, isTop);
                if (this.humanTile.animations.name !== animationName) {
                    this.humanTile.animations.play(animationName, FRAME_RATE, true);
                }
                if (isLeft != null) {
                    this.humanTile.scale.set(isLeft ? 1 : -1, 1);
                }
                break;
            case ANIMATION.SMOKE:
            case ANIMATION.TYPE:
            case ANIMATION.TALK:
                // Looped sided animation (left/right)
                const animationSmokeName = animation + '';
                if (this.humanTile.animations.name !== animationSmokeName) {
                    this.humanTile.animations.play(animationSmokeName, FRAME_RATE, true);
                }
                if (isLeft != null) {
                    this.humanTile.scale.set(isLeft ? 1 : -1, 1);
                }
                break;
            case ANIMATION.SIT_DOWN:
            case ANIMATION.STAND_UP:
                // Non looped sided animation (left/right)
                const animationSitDownName = animation + '';
                if (this.humanTile.animations.name !== animationSitDownName) {
                    this.humanTile.animations.play(animationSitDownName, FRAME_RATE, false);
                }
                if (isLeft != null) {
                    this.humanTile.scale.set(isLeft ? 1 : -1, 1);
                }
                break;
            default:
                console.log('UNKNOWN ANIMATION ' + animation);
        }
    }

    static getAnimationTime(animation: ANIMATION) {
        return this.getAnimationFrames(animation).length * Phaser.Timer.SECOND / FRAME_RATE;
    }

    private static getAnimationFrames(animation: ANIMATION, topOriented: boolean = null) {
        switch (animation) {
            case ANIMATION.FREEZE: return topOriented ? [18, 19, 20] : [12, 13, 14];
            case ANIMATION.WALK: return topOriented ? [6, 7, 8, 9, 10, 11] : [0, 1, 2, 3, 4, 5];
            case ANIMATION.SIT_DOWN: return [12, 36, 37, 38, 39];
            case ANIMATION.STAND_UP: return [39, 38, 37, 36, 12];
            case ANIMATION.TYPE: return [42, 43, 44, 45];
            case ANIMATION.TALK: return [48, 49, 50, 51, 52, 53];
            case ANIMATION.SMOKE:
                let smoke_frames = [24, 25, 26, 27, 30, 31, 32, 33];
                for (let i = 0; i < 6; i++) {
                    // Take smoke length
                    smoke_frames.push(33)
                }
                smoke_frames = smoke_frames.concat([32, 31, 30, 27, 26, 25, 24]);
                for (let i = 0; i < 20; i++) {
                    // Do nothing length
                    smoke_frames.push(24)
                }
                return smoke_frames;
            default:
                console.log('UNKNOWN ANIMATION ' + animation);
        }
    }

    private static getAnimations(): ANIMATION[] {
        return [
            ANIMATION.FREEZE,
            ANIMATION.WALK,
            ANIMATION.SMOKE,
            ANIMATION.SIT_DOWN,
            ANIMATION.STAND_UP,
            ANIMATION.TYPE,
            ANIMATION.TALK,
        ];
    }

    private static hasTopOrientedVariation(animation: ANIMATION) {
        return [ANIMATION.WALK, ANIMATION.FREEZE].indexOf(animation) > -1;
    }
}
