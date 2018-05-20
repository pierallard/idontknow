import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {MoveThenActAbstractState} from "./MoveThenActAbstractState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {Employee} from "../human_stuff/Employee";

const SECOND_MIN = 15 * Phaser.Timer.SECOND;
const SECOND_MAX = 40 * Phaser.Timer.SECOND;

export class TypeState extends MoveThenActAbstractState {
    private typeTime: number;
    private percentage: number;
    private finished: boolean;
    private lastUpdatedAt: number;
    private timer: Phaser.Timer;

    constructor(human: Employee, worldKnowledge: WorldKnowledge, tries: number = 0) {
        super(human, worldKnowledge, tries);

        this.percentage = null;
        this.finished = false;
    }

    start(game: Phaser.Game): boolean {
        this.objectReferer = this.worldKnowledge.getClosestReferer(['Desk'], 1, this.human.getPosition());
        if (this.objectReferer === null) {
            return false;
        }

        this.typeTime = Phaser.Math.random(SECOND_MIN, SECOND_MAX);

        this.timer = game.time.create(true);
        this.timer.start();

        return super.start(game);
    }

    private getTime() {
        return this.timer.ms;
    }

    getNextState(): HumanState {
        if (this.percentage !== null && this.percentage < 1) {
            const diffTime = this.getTime() - this.lastUpdatedAt;
            const workProgress = this.getWorkProgress(diffTime);
            const levelProgress = this.getLevelProgress(diffTime);
            this.percentage += workProgress;
            this.worldKnowledge.addProgress(this.human, levelProgress, 0);
            this.lastUpdatedAt = this.getTime();
        }
        if (this.percentage !== null && this.percentage >= 1 && !this.finished) {
            this.finished = true;
            this.human.loadAnimation(ANIMATION.STAND_UP);
            this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
                this.finish();
            }, this));
        }
        return super.getNextState();
    }

    protected act(): void {
        this.human.loadAnimation(ANIMATION.SIT_DOWN, this.objectReferer.getObject().forceLeftOrientation(this.objectReferer.getIdentifier()));
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN), () => {
            this.human.loadAnimation(ANIMATION.TYPE, this.objectReferer.forceLeftOrientation(), this.objectReferer.forceTopOrientation());
            this.percentage = 0;
            this.lastUpdatedAt = this.getTime();
        }));
    }

    protected getActTime(): number {
        return null;
    }

    getState(): STATE {
        return STATE.TYPE;
    }

    protected subGetRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.LAPTOP;
    }

    protected getRetryState(): HumanState {
        return new TypeState(this.human, this.worldKnowledge, this.tries + 1)
    }

    /**
     * Returns the quantity of work the employee did.
     * Returns a number between 0 and 1 (nothing -> he worked the assigned time)
     *
     * @param {number} diffTime
     * @returns {number}
     */
    private getWorkProgress(diffTime: number): number {
        return diffTime / this.typeTime;
    }

    /**
     * Returns the quantity of work the employee did
     * Returns a number between 0 and 1
     * 1 is when the user works the full time and have full experience.
     *
     * @param {number} diffTime
     * @returns {number}
     */
    private getLevelProgress(diffTime: number) {
        return diffTime / SECOND_MAX * this.human.getExperienceRatio() * this.worldKnowledge.getAmbiance(this.human.getPosition());
    }

    getDescription(): string {
        if (!this.isHumanOnTheRightCell) {
            return super.getDescription();
        } else {
            return 'is working (' + Math.round(this.percentage * 100) + '%)';
        }
    }
}
