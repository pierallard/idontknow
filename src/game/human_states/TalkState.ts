import {Human} from "../human_stuff/Human";
import {HumanState} from "./HumanState";
import {World} from "../World";
import {ANIMATION, HumanAnimationManager} from "../human_stuff/HumanAnimationManager";

export class TalkState implements HumanState {
    private human: Human;
    private active: boolean;
    private anotherHuman: Human;
    private isHumanOnTheRightCell: boolean;
    private game: Phaser.Game;
    private world: World;
    private goalCell: PIXI.Point;
    private cells: PIXI.Point[];
    private meetingStarted: boolean;
    private events: Phaser.TimerEvent[];
    private time: number;

    constructor(
        human: Human,
        anotherHuman: Human,
        game: Phaser.Game,
        world: World,
        cells: PIXI.Point[] = null,
        goalCell: PIXI.Point = null,
        time: number = null
    ) {
        this.human = human;
        this.anotherHuman = anotherHuman;
        this.isHumanOnTheRightCell = false;
        this.game = game;
        this.world = world;
        this.goalCell = goalCell;
        this.cells = cells;
        this.meetingStarted = false;
        this.events = [];
        this.time = time ? time : Phaser.Math.random(8, 20) * Phaser.Timer.SECOND;
    }

    isActive(): boolean {
        if (!this.meetingStarted && this.isMeetingReady()) {
            this.meetingStarted = true;
            this.game.time.events.add(this.time, this.end, this);

            let animation = ANIMATION.TALK;
            if (Math.random() > 0.5) {
                animation = TalkState.otherAnimation(animation);
            }
            this.human.loadAnimation(animation);
            this.events.push(this.game.time.events.add(Phaser.Math.random(1, 3) * HumanAnimationManager.getAnimationTime(animation), this.switchAnimation, this, TalkState.otherAnimation(animation)));
        }

        return this.active;
    }

    switchAnimation(animation: ANIMATION) {
        this.human.loadAnimation(animation);
        this.events.push(this.game.time.events.add(Phaser.Math.random(1, 3) * HumanAnimationManager.getAnimationTime(animation), this.switchAnimation, this, TalkState.otherAnimation(animation)));
    }

    start(game: Phaser.Game): void {
        if (this.cells === null) {
            // This human is the initiator of the talk. He have to find meeting place.
            this.cells = this.world.getGround().getRandomNeighborCells();
            if (this.cells === null) {
                console.log('No meeting point found!');
                this.active = false;
                return;
            }
            this.goalCell = this.cells[0];
            this.anotherHuman.forceTalk(this.cells, this.cells[1], this.time);
        }

        this.human.moveTo(this.goalCell);
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

    private isMeetingReady() {
        for (let i = 0; i < this.cells.length; i++) {
            const human = this.world.getHumanAt(this.cells[i]);
            if (human === null || human.isMoving()) {
                return false;
            }
        }

        return true;
    }

    private static otherAnimation(animation: ANIMATION) {
        return animation === ANIMATION.TALK ? ANIMATION.FREEZE : ANIMATION.TALK;
    }
}