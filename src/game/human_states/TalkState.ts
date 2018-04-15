import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {Meeting} from "./Meeting";
import {Direction} from "../Direction";
import {STATE} from "../human_stuff/HumanStateManager";

export class TalkState implements HumanState {
    private human: Employee;
    private active: boolean;
    private anotherHuman: Employee;
    private game: Phaser.Game;
    private worldKnowledge: WorldKnowledge;
    private meetingStarted: boolean;
    private events: Phaser.TimerEvent[];
    private meeting: Meeting;

    constructor(
        human: Employee,
        anotherHuman: Employee,
        game: Phaser.Game,
        worldKnowledge: WorldKnowledge,
        meeting: Meeting = null
    ) {
        this.human = human;
        this.anotherHuman = anotherHuman;
        this.game = game;
        this.worldKnowledge = worldKnowledge;
        this.meetingStarted = false;
        this.events = [];
        this.meeting = meeting;
    }

    getNextState(): HumanState {
        if (!this.meetingStarted) {
            if (!this.meeting.areAllHumanStillInMeeting()) {
                this.active = false;
            } else {
                if (this.meeting.isReady()) {
                    this.meetingStarted = true;
                    this.game.time.events.add(this.meeting.getTime() + Math.random() * Phaser.Timer.SECOND, this.end, this);
                    this.human.updateMoodFromState();

                    let animation = ANIMATION.TALK;
                    if (Math.random() > 0.5) {
                        animation = TalkState.otherAnimation(animation);
                    }
                    this.switchAnimation(animation);
                } else if (!this.human.isMoving()) {
                    const direction = Direction.getNeighborDirection(
                        this.human.getPosition(),
                        this.meeting.getAnotherHuman(this.human).getPosition()
                    );
                    this.human.loadAnimation(ANIMATION.FREEZE, Direction.isLeft(direction), Direction.isTop(direction));
                }
            }
        }

        return this.active ? this : null;
    }

    switchAnimation(animation: ANIMATION) {
        const direction = Direction.getNeighborDirection(
            this.human.getPosition(),
            this.meeting.getAnotherHuman(this.human).getPosition()
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
        this.active = true;

        if (this.meeting === null) {
            this.meeting = new Meeting(
                [this.human, this.anotherHuman],
                Phaser.Math.random(8, 20) * Phaser.Timer.SECOND,
                this.worldKnowledge
            );

            if (!this.anotherHuman.goMeeting(this.meeting)) {
                this.end();
                return false;
            }
        }
        if (!this.human.moveTo(this.meeting.getCell(this.human))) {
            this.end();
            return false;
        }

        return true;
    }

    end(): void {
        this.human.hideTalkBubble();
        this.events.forEach((event) => {
            this.game.time.events.remove(event);
        });
        this.active = false;
    }

    stop(game: Phaser.Game): void {
        this.end();
    }

    getState(): STATE {
        return STATE.TALK;
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.TALK ? ANIMATION.FREEZE : ANIMATION.TALK;
    }
}