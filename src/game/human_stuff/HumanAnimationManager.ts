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
    DRINK,
    RAGE,
    FREEZE_SIT,
    SIT_TALK,
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
        let animationName = animation + '';
        if (HumanAnimationManager.hasTopOrientedVariation(animation)) {
            animationName = this.getAnimationName(animation, isTop);
        }
        if (this.humanTile.animations.name !== animationName) {
            this.humanTile.animations.play(animationName, FRAME_RATE, HumanAnimationManager.isLooped(animation));
        }
        if (isLeft != null) {
            this.humanTile.scale.set(isLeft ? 1 : -1, 1);
        }
    }

    static getAnimationTime(animation: ANIMATION) {
        return this.getAnimationFrames(animation).length * Phaser.Timer.SECOND / FRAME_RATE;
    }

    private static getAnimationFrames(animation: ANIMATION, topOriented: boolean = null) {
        switch (animation) {
            case ANIMATION.FREEZE: return topOriented ? [18, 19, 20] : [12, 13, 14];
            case ANIMATION.FREEZE_SIT: return topOriented ? [21, 22, 23] : [15, 16, 17];
            case ANIMATION.WALK: return topOriented ? [6, 7, 8, 9, 10, 11] : [0, 1, 2, 3, 4, 5];
            case ANIMATION.SIT_DOWN: return topOriented ? [18, 68, 69, 70, 71] : [12, 32, 33, 34, 35];
            case ANIMATION.STAND_UP: return topOriented ? [71, 70, 69, 68, 18] : [35, 34, 33, 32, 12];
            case ANIMATION.TYPE: return [36, 37, 38, 39];
            case ANIMATION.TALK: return topOriented ? [46, 47, 48, 49, 50, 51] : [40, 41, 42, 43, 44, 45];
            case ANIMATION.SIT_TALK: return topOriented ? [78, 79, 80, 81, 82, 83] : [72, 73, 74, 75, 76, 77];
            case ANIMATION.RAGE:
                let rage_frames = [57, 58, 59, 60];
                for (let i = 0; i < 4; i++) {
                    rage_frames = rage_frames.concat([61, 62, 63, 64, 65, 64]);
                }
                return rage_frames.concat([65, 66, 67]);
            case ANIMATION.DRINK:
                return [52, 53, 52, 52, 52, 54, 55, 55, 56, 55, 55, 56, 55, 54, 52, 52, 52, 52, 52, 52, 52];
            case ANIMATION.SMOKE:
                let smoke_frames = [24, 25, 26, 27, 28, 29, 30, 31];
                for (let i = 0; i < 6; i++) {
                    // Take smoke length
                    smoke_frames.push(31)
                }
                smoke_frames = smoke_frames.concat([30, 29, 28, 27, 26, 25, 24]);
                for (let i = 0; i < 20; i++) {
                    // Do nothing length
                    smoke_frames.push(24)
                }
                return smoke_frames;
            default:
                throw 'UNKNOWN ANIMATION ' + animation;
        }
    }

    private static getAnimations(): ANIMATION[] {
        return [
            ANIMATION.FREEZE_SIT,
            ANIMATION.FREEZE,
            ANIMATION.WALK,
            ANIMATION.SMOKE,
            ANIMATION.SIT_DOWN,
            ANIMATION.STAND_UP,
            ANIMATION.TYPE,
            ANIMATION.TALK,
            ANIMATION.DRINK,
            ANIMATION.RAGE,
            ANIMATION.SIT_TALK,
        ];
    }

    private static hasTopOrientedVariation(animation: ANIMATION) {
        return [
            ANIMATION.WALK,
            ANIMATION.FREEZE,
            ANIMATION.TALK,
            ANIMATION.SIT_DOWN,
            ANIMATION.STAND_UP,
            ANIMATION.FREEZE_SIT,
            ANIMATION.SIT_TALK,
        ].indexOf(animation) > -1;
    }


    private static isLooped(animation: ANIMATION) {
        return [
            ANIMATION.FREEZE,
            ANIMATION.WALK,
            ANIMATION.TALK,
            ANIMATION.SMOKE,
            ANIMATION.TYPE,
            ANIMATION.DRINK,
            ANIMATION.FREEZE_SIT,
            ANIMATION.SIT_TALK,
        ].indexOf(animation) > -1;
    }

    static getAnimationStr(animation: ANIMATION): string {
        switch (animation) {
            case ANIMATION.FREEZE: return 'FZ';
            case ANIMATION.FREEZE_SIT: return 'FS';
            case ANIMATION.WALK: return 'WK';
            case ANIMATION.SIT_DOWN: return 'SD';
            case ANIMATION.STAND_UP: return 'SU';
            case ANIMATION.TYPE: return 'TP';
            case ANIMATION.TALK: return 'TK';
            case ANIMATION.RAGE: return 'RG';
            case ANIMATION.DRINK: return 'DK';
            case ANIMATION.SMOKE: return 'SK';
            case ANIMATION.SIT_TALK: return 'ST';
            default:
                throw 'UNKNOWN ANIMATION ' + animation;
        }
    }
}
