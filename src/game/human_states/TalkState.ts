import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {Meeting} from "./Meeting";
import {Direction} from "../Direction";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {RageState} from "./RageState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

export class TalkState extends AbstractState {
    private anotherHuman: Employee;
    private worldKnowledge: WorldKnowledge;
    private meetingStarted: boolean;
    private meeting: Meeting;

    constructor(
        human: Employee,
        anotherHuman: Employee,
        worldKnowledge: WorldKnowledge,
        meeting: Meeting = null
    ) {
        super(human);
        this.anotherHuman = anotherHuman;
        this.worldKnowledge = worldKnowledge;
        this.meetingStarted = false;
        this.meeting = meeting;
    }

    getNextState(): HumanState {
        if (!this.meetingStarted) {
            if (!this.meeting.areAllHumanStillInMeeting()) {
                this.active = false;
            } else {
                if (this.meeting.isReady()) {
                    this.meetingStarted = true;
                    this.game.time.events.add(this.meeting.getTime() + Math.random() * Phaser.Timer.SECOND, this.stop, this); // TODO this will fail
                    this.human.updateMoodFromState();

                    let animation = ANIMATION.TALK;
                    if (Math.random() > 0.5) {
                        animation = TalkState.otherAnimation(animation);
                    }
                    this.switchAnimation(animation);
                } else if (!this.human.isMoving()) {
                    const direction = Direction.getNeighborDirection(
                        this.human.getPosition().to2DPoint(),
                        this.meeting.getAnotherHuman(this.human).getPosition().to2DPoint()
                    );
                    this.human.loadAnimation(ANIMATION.FREEZE, Direction.isLeft(direction), Direction.isTop(direction));
                }
            }
        }

        return super.getNextState();
    }

    getDescription() {
        if (!this.meetingStarted) {
            if (this.human.isMoving()) {
                return 'is looking for a place to talk';
            } else {
                return 'is waiting for somebody to talk';
            }
        } else {
            return 'is talking';
        }
    }

    private switchAnimation(animation: ANIMATION) {
        const direction = Direction.getNeighborDirection(
            this.human.getPosition().to2DPoint(),
            this.meeting.getAnotherHuman(this.human).getPosition().to2DPoint()
        );
        if (animation === ANIMATION.TALK) {
            this.human.showTalkBubble();
        } else {
            this.human.hideTalkBubble();
        }
        this.human.loadAnimation(animation, Direction.isLeft(direction), Direction.isTop(direction));
        this.events.push(this.game.time.events.add(
            Phaser.Math.random(3, 6) * HumanAnimationManager.getAnimationTime(animation),
            this.switchAnimation,
            this,
            TalkState.otherAnimation(animation)
        ));
    }

    start(game: Phaser.Game): boolean {
        super.start(game);
        if (this.anotherHuman === null && this.meeting === null) {
            return false;
        }

        if (this.meeting === null) {
            this.meeting = new Meeting(
                [this.human, this.anotherHuman],
                Phaser.Math.random(8, 20) * Phaser.Timer.SECOND,
                this.worldKnowledge
            );

            if (!this.anotherHuman.goMeeting(this.meeting)) {
                this.stop();
                return false;
            }
        }
        if (!this.human.moveTo(this.meeting.getCell(this.human))) {
            this.stop();
            return false;
        }

        return true;
    }

    stop() {
        this.human.hideTalkBubble();
        super.stop();
    }

    getState(): STATE {
        return STATE.TALK;
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.TALK ? ANIMATION.FREEZE : ANIMATION.TALK;
    }

    getRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.HUMAN;
    }
}
