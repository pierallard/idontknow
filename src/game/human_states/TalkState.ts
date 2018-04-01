import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {World} from "../World";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {Meeting} from "./Meeting";

export class TalkState implements HumanState {
    private human: Human;
    private active: boolean;
    private anotherHuman: Human;
    private game: Phaser.Game;
    private world: World;
    private meetingStarted: boolean;
    private events: Phaser.TimerEvent[];
    private meeting: Meeting;

    constructor(
        human: Human,
        anotherHuman: Human,
        game: Phaser.Game,
        world: World,
        meeting: Meeting = null
    ) {
        this.human = human;
        this.anotherHuman = anotherHuman;
        this.game = game;
        this.world = world;
        this.meetingStarted = false;
        this.events = [];
        this.meeting = meeting;
    }

    isActive(): boolean {
        if (!this.meetingStarted && this.meeting.isReady()) {
            this.meetingStarted = true;
            this.game.time.events.add(this.meeting.getTime(), this.end, this);

            let animation = ANIMATION.TALK;
            if (Math.random() > 0.5) {
                animation = TalkState.otherAnimation(animation);
            }
            this.human.loadAnimation(animation);
            this.events.push(this.game.time.events.add(Phaser.Math.random(3, 6) * HumanAnimationManager.getAnimationTime(animation), this.switchAnimation, this, TalkState.otherAnimation(animation)));
        }

        return this.active;
    }

    switchAnimation(animation: ANIMATION) {
        this.human.loadAnimation(animation);
        this.events.push(this.game.time.events.add(Phaser.Math.random(3, 6) * HumanAnimationManager.getAnimationTime(animation), this.switchAnimation, this, TalkState.otherAnimation(animation)));
    }

    start(game: Phaser.Game): void {
        if (this.meeting === null) {
            this.meeting = new Meeting(
                [this.human, this.anotherHuman],
                Phaser.Math.random(8, 20) * Phaser.Timer.SECOND,
                this.world
            );
            this.anotherHuman.goMeeting(this.meeting);
        }
        this.human.moveTo(this.meeting.getCell(this.human));
        this.active = true;
    }

    end(): void {
        this.events.forEach((event) => {
            this.game.time.events.remove(event);
        });
        this.active = false;
    }

    stop(game: Phaser.Game): void {
        this.events.forEach((event) => {
            this.game.time.events.remove(event);
        });
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.TALK ? ANIMATION.FREEZE : ANIMATION.TALK;
    }
}