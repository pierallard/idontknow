import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {Meeting} from "./Meeting";
import {Direction} from "../Direction";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {TableMeeting} from "./TableMeeting";
import {Table} from "../objects/Table";
import {PositionTransformer} from "../PositionTransformer";

export class SitTalkState extends AbstractState {
    private anotherHumans: Employee[];
    private worldKnowledge: WorldKnowledge;
    private meetingStarted: boolean;
    private meeting: TableMeeting;
    private table: Table;
    private isHumanOnTheRightCell: boolean;
    private isHumanSit: boolean;

    constructor(
        human: Employee,
        table: Table,
        anotherHumans: Employee[],
        worldKnowledge: WorldKnowledge,
        meeting: TableMeeting = null
    ) {
        super(human);
        this.anotherHumans = anotherHumans;
        this.table = table;
        this.worldKnowledge = worldKnowledge;
        this.meetingStarted = false;
        this.meeting = meeting;
        this.isHumanOnTheRightCell = false;
        this.isHumanSit = false;
    }

    getNextState(): HumanState {
        if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
            this.isHumanOnTheRightCell = true;
            this.human.interactWith(this.meeting.getCell(this.human), this.meeting.getTable().forceOrientation());
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                console.log('Sit !');
                this.human.loadAnimation(ANIMATION.SIT_DOWN, this.meeting.getTable().forceOrientation());
                this.isHumanSit = true;
            }));
        }

        if (this.isHumanSit && !this.meetingStarted) {
            if (!this.meeting.areAllHumanStillInMeeting()) {
                this.active = false;
            } else {
                if (this.meeting.isReady()) {
                    this.meetingStarted = true;
                    this.game.time.events.add(this.meeting.getTime() + Math.random() * Phaser.Timer.SECOND, this.stop, this); // TODO this will fail
                    this.human.updateMoodFromState();

                    let animation = ANIMATION.TALK;
                    if (Math.random() > 0.5) {
                        animation = SitTalkState.otherAnimation(animation);
                    }
                    this.switchAnimation(animation);
                }
            }
        }

        return super.getNextState();
    }

    private switchAnimation(animation: ANIMATION) {
        if (animation === ANIMATION.TALK) {
            this.human.showTalkBubble();
        } else {
            this.human.hideTalkBubble();
        }
        this.human.loadAnimation(animation);
        this.events.push(this.game.time.events.add(
            Phaser.Math.random(3, 6) * HumanAnimationManager.getAnimationTime(animation),
            this.switchAnimation,
            this,
            SitTalkState.otherAnimation(animation)
        ));
    }

    start(game: Phaser.Game): boolean {
        super.start(game);

        if (this.meeting === null) {
            this.meeting = new TableMeeting(
                this.anotherHumans.concat([this.human]),
                Phaser.Math.random(8, 20) * Phaser.Timer.SECOND,
                this.table
            );

            let shouldStop = false;
            this.anotherHumans.forEach((human) => {
                if (!this.human.goSitMeeting(this.meeting)) {
                    shouldStop = true;
                }
            });
            if (shouldStop) {
                this.stop();
                return false;
            }
        }
        const referer = this.meeting.getCell(this.human);
        if (!this.human.moveToClosest(referer.getPosition(), referer.getEntries())) {
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

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.meeting.getCell(this.human).getPosition());
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.TALK ? ANIMATION.FREEZE : ANIMATION.TALK;
    }
}
