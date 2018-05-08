import {Employee} from "../human_stuff/Employee";
import {HumanState} from "./HumanState";
import {WorldKnowledge} from "../WorldKnowledge";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";
import {STATE} from "../human_stuff/HumanStateManager";
import {AbstractState} from "./AbstractState";
import {TableMeeting} from "./TableMeeting";
import {Table} from "../objects/Table";
import {PositionTransformer} from "../PositionTransformer";
import {RageState} from "./RageState";
import {RAGE_IMAGE} from "../human_stuff/ThoughtBubble";

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
        if (!this.worldKnowledge.hasObject(this.table)) {
            this.active = false;
            this.human.stopWalk();

            return new RageState(this.human, this);
        } else {
            if (!this.isHumanOnTheRightCell && this.isNeighborPosition()) {
                this.isHumanOnTheRightCell = true;
                this.human.interactWith(this.meeting.getCell(this.human), this.meeting.getTable().forceLeftOrientation(this.meeting.getCell(this.human).getIdentifier()));
                this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                    this.human.loadAnimation(
                        ANIMATION.SIT_DOWN,
                        this.meeting.getTable().forceLeftOrientation(this.meeting.getCell(this.human).getIdentifier()),
                        this.table.forceTopOrientation(this.meeting.getCell(this.human).getIdentifier())
                    );
                    this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.SIT_DOWN) + 100, () => {
                        this.human.loadAnimation(ANIMATION.SIT_FREEZE);
                    }, this));
                    this.isHumanSit = true;
                }));
            }

            if (!this.isHumanOnTheRightCell && !this.meetingStarted && this.meeting.aPlaceWasTakenBySomeoneElse()) {
                this.active = false;
                this.human.stopWalk();

                return new RageState(this.human, this);
            }

            if (this.isHumanSit && !this.meetingStarted && this.meeting.isReady()) {
                this.meetingStarted = true;
                this.game.time.events.add(this.meeting.getTime() + Math.random() * Phaser.Timer.SECOND, this.endMeeting, this); // TODO this will fail
                this.human.updateMoodFromState();

                let animation = ANIMATION.SIT_TALK;
                if (Math.random() > 0.5) {
                    animation = SitTalkState.otherAnimation(animation);
                }
                this.switchAnimation(animation);
            }
        }

        return super.getNextState();
    }

    private switchAnimation(animation: ANIMATION) {
        if (animation === ANIMATION.SIT_TALK) {
            this.human.showTalkBubble();
        } else {
            this.human.hideTalkBubble();
        }
        this.human.loadAnimation(animation);
        this.events.push(this.game.time.events.add(
            Phaser.Math.random(3, 6) * ((animation !== ANIMATION.SIT_TALK) ? 3 : 1) * HumanAnimationManager.getAnimationTime(animation),
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
                if (!human.goSitMeeting(this.meeting)) {
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

    endMeeting() {
        this.events.forEach((event) => {
            this.game.time.events.remove(event);
        });
        this.human.hideTalkBubble();
        this.human.loadAnimation(ANIMATION.STAND_UP, this.meeting.getTable().forceLeftOrientation(this.meeting.getCell(this.human).getIdentifier()));
        this.events.push(this.game.time.events.add(HumanAnimationManager.getAnimationTime(ANIMATION.STAND_UP) + 100, () => {
            this.human.goToFreeCell(this.meeting.getCell(this.human));
            this.events.push(this.game.time.events.add(this.human.getWalkDuration() + 100, () => {
                this.stop();
            }));
        }));
    }

    getState(): STATE {
        return STATE.SIT_TALK;
    }

    private isNeighborPosition() {
        return !this.human.isMoving() &&
            PositionTransformer.isNeighbor(this.human.getPosition(), this.meeting.getCell(this.human).getPosition());
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.SIT_TALK ? ANIMATION.SIT_FREEZE : ANIMATION.SIT_TALK;
    }

    getRageImage(): RAGE_IMAGE {
        return RAGE_IMAGE.PATH;
    }
}
