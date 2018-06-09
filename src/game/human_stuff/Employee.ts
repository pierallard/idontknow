import {CELL_HEIGHT, PositionTransformer} from "../PositionTransformer";
import {WorldKnowledge} from "../WorldKnowledge";
import {ClosestPathFinder} from "./ClosestPathFinder";
import {DIRECTION, Direction} from "../Direction";
import {ANIMATION, HumanAnimationManager} from "./HumanAnimationManager";
import {HumanStateManager, STATE} from "./HumanStateManager";
import {ObjectSelector} from "../objects/ObjectSelector";
import {Meeting} from "../human_states/Meeting";
import {TalkBubble} from "./TalkBubble";
import {HumanMoodManager, MOOD} from "./HumanMoodManager";
import {MoodSprite} from "./MoodSprite";
import {GROUP_OBJECTS_AND_HUMANS, GROUP_INFOS, GROUP_INTERFACE} from "../game_state/Play";
import {DAY_DURATION, HumanProperties} from "./HumanProperties";
import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";
import {ObjectReferer} from "../objects/ObjectReferer";
import {TableMeeting} from "../human_states/TableMeeting";
import {RAGE_IMAGE, ThoughtBubble} from "./ThoughtBubble";
import {COLOR} from "../Pico8Colors";
import {SPRITE_DEBUG} from "../objects/AbstractObject";
import {ObjectOrientation} from "../objects/ObjectOrientation";
import {Price} from "../objects/Price";
import {HumanState} from "../human_states/HumanState";
import {Point} from "../Point";

const MAX_WALK_CELL_DURATION = 1500;
const MIN_WALK_CELL_DURATION = 800;

const XP_MIN = 0.5;
const XP_MAX = 1.5;

const MAX_RETRIES = 3;
const MIN_RETRIES = 0;

const GAP_FROM_BOTTOM = -8;
const PATH_DEBUG = false;

export const HUMAN_SPRITE_VARIATIONS = ['human1', 'human2', 'human3'];
export const HUMAN_SPRITE_COLORS = ['green', 'pink', 'red'];

export class Employee {
    private sprite: Phaser.TileSprite;
    private cell: Point;
    private game: Phaser.Game;
    private moving: boolean;
    private path: Point[];
    private worldKnowledge: WorldKnowledge;
    private closestPathFinder: ClosestPathFinder;
    private anchorPixels: PIXI.Point;
    private animationManager: HumanAnimationManager;
    private stateManager: HumanStateManager;
    private debugGraphics: Phaser.Graphics;
    private talkBubble: TalkBubble;
    private thoughtBubble: ThoughtBubble;
    private moodManager: HumanMoodManager;
    private moodSprite: MoodSprite;
    private humanProperties: HumanProperties;
    private groups: {[index: string] : Phaser.Group};

    constructor(cell: Point, humanProperties: HumanProperties) {
        this.cell = cell;
        this.moving = false;
        this.path = [];
        this.stateManager = new HumanStateManager(this);
        this.anchorPixels = new PIXI.Point(0, GAP_FROM_BOTTOM);
        this.animationManager = new HumanAnimationManager();
        this.talkBubble = new TalkBubble();
        this.thoughtBubble = new ThoughtBubble();
        this.moodManager = new HumanMoodManager();
        this.moodSprite = new MoodSprite();
        this.humanProperties = humanProperties;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}, worldKnowledge: WorldKnowledge) {
        this.game = game;
        this.worldKnowledge = worldKnowledge;
        this.groups = groups;
        this.moodManager.create(game);

        this.sprite = game.add.tileSprite(
            PositionTransformer.getRealPosition(this.cell).x + this.anchorPixels.x,
            PositionTransformer.getRealPosition(this.cell).y + this.anchorPixels.y,
            24,
            25,
            this.humanProperties.getSpriteKey()
        );
        this.animationManager.create(this.sprite);
        this.sprite.anchor.set(0.5, 1.0);

        ObjectSelector.makeSelectable([this.sprite], () => {
            this.worldKnowledge.setSelectedHuman(this);
        }, () => {
            this.worldKnowledge.unselectHuman();
        });
        groups[GROUP_OBJECTS_AND_HUMANS + this.cell.z].add(this.sprite);

        this.animationManager.loadAnimation(ANIMATION.FREEZE, true, false);
        this.closestPathFinder = new ClosestPathFinder(game, worldKnowledge);
        this.stateManager.create(game, worldKnowledge, this.animationManager);
        this.talkBubble.create(this.sprite, this.game, groups[GROUP_OBJECTS_AND_HUMANS + this.cell.z]);
        this.thoughtBubble.create(this.sprite, this.game, groups[GROUP_OBJECTS_AND_HUMANS + this.cell.z]);
        this.moodSprite.create(this.sprite, this.game, groups[GROUP_INFOS]);

        if (PATH_DEBUG || SPRITE_DEBUG) {
            this.debugGraphics = game.add.graphics(0, 0, groups[GROUP_INTERFACE]);
        }

        this.worldKnowledge.addMoneyInWallet(this.humanProperties.getRealWage(), 3 * Phaser.Timer.SECOND);
        this.game.time.events.loop(DAY_DURATION, () => {
            this.worldKnowledge.addMoneyInWallet(this.humanProperties.getRealWage(), 3 * Phaser.Timer.SECOND);
        });
    }

    update() {
        this.talkBubble.update();
        this.thoughtBubble.update();
        this.stateManager.updateState(this.game);
        this.moodManager.update();
        this.moodSprite.update(this.moodManager.getGeneralMood(), [
            this.moodManager.getMood(MOOD.HUNGER),
            this.moodManager.getMood(MOOD.SOCIAL),
            this.moodManager.getMood(MOOD.RELAXATION)
        ]);

        if (PATH_DEBUG) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, COLOR.LIGHT_GREEN);
            if (this.path !== null && this.path.length > 0) {
                this.debugGraphics.moveTo(
                    this.sprite.position.x,
                    this.sprite.position.y
                );
                this.path.forEach((pathItem) => {
                    this.debugGraphics.lineTo(
                        PositionTransformer.getRealPosition(pathItem).x,
                        PositionTransformer.getRealPosition(pathItem).y - CELL_HEIGHT / 2
                    );
                });
            }
        }

        if (SPRITE_DEBUG) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(1, COLOR.LIGHT_BLUE);
            const realPosition = this.sprite.position;
            this.debugGraphics.moveTo(realPosition.x - 1.5, realPosition.y + 0.5);
            this.debugGraphics.lineTo(realPosition.x + 2.5, realPosition.y + 0.5);
            this.debugGraphics.moveTo(realPosition.x + 0.5, realPosition.y - 1.5);
            this.debugGraphics.lineTo(realPosition.x + 0.5, realPosition.y + 2.5);
        }
    }

    goMeeting(meeting: Meeting): boolean {
        return this.stateManager.goMeeting(this.game, meeting);
    }

    goSitMeeting(meeting: TableMeeting) {
        return this.stateManager.goSitMeeting(this.game, meeting);
    }

    moveTo(cell: Point): boolean {
        const path = this.closestPathFinder.getPath(this.cell, cell);
        if (path === null) {
            this.path = [];
            this.stateManager.reset(this.game);

            return false;
        }

        this.path = path;
        if (!this.moving) {
            this.popPath();
        }
        return true;
    }

    moveToClosest(cell: Point, entries: DIRECTION[] = [DIRECTION.BOTTOM, DIRECTION.RIGHT, DIRECTION.TOP, DIRECTION.LEFT]): boolean {
        const path = this.closestPathFinder.getNeighborPath(this.cell, cell, entries);
        if (path === null) {
            this.path = [];

            return false;
        }

        this.path = path;
        if (!this.moving) {
            this.popPath();
        }

        return true;
    }

    private animateMove(direction: DIRECTION) {
        const isLeftLooking = Employee.isHumanLeftLooking(direction);
        const isTopLooking = Employee.isHumanTopLooking(direction);
        this.animationManager.loadAnimation(ANIMATION.WALK, isLeftLooking, isTopLooking);
        this.moving = true;
        this.game.add.tween(this.sprite.position).to({
            x: PositionTransformer.getRealPosition(this.cell).x + this.anchorPixels.x,
            y: PositionTransformer.getRealPosition(this.cell).y + this.anchorPixels.y
        }, this.getWalkDuration(), 'Linear', true).onComplete.add(() => {
            this.popPath();
        }, this);
    }

    getWalkDuration(): number {
        return MIN_WALK_CELL_DURATION + (MAX_WALK_CELL_DURATION - MIN_WALK_CELL_DURATION) * (1 - this.humanProperties.getSpeed());
    }

    private popPath() {
        this.moving = false;
        if (this.path !== null && this.path.length > 0) {
            const next = this.path.shift();
            console.log(this.cell, next);
            const direction = Direction.getNeighborDirection(this.cell.to2DPoint(), next.to2DPoint());
            if (!this.moving) {
                if (this.cell.z !== next.z) {
                    this.groups[GROUP_OBJECTS_AND_HUMANS + this.cell.z].remove(this.sprite);
                    this.groups[GROUP_OBJECTS_AND_HUMANS + next.z].add(this.sprite);
                }
                this.cell = next;
                this.anchorPixels.x = 0;
                this.anchorPixels.y = GAP_FROM_BOTTOM;
                this.animateMove(direction);
            }
        }
    }

    getPosition(): Point {
        return this.cell;
    }

    isMoving(): boolean {
        return this.moving;
    }

    interactWith(objectReferer: ObjectReferer, isLeft: boolean = null) {
        const direction = Direction.getNeighborDirection(this.cell.to2DPoint(), objectReferer.getPosition().to2DPoint());
        const side = (isLeft !== null) ? isLeft : Employee.isHumanLeftLooking(direction);
        // Employee has to gap 5px from the sofa to be sit properly, and 1px from the bottom.
        this.anchorPixels.x = objectReferer.getPositionGap().x + (side ? -5 : 5);
        this.anchorPixels.y = objectReferer.getPositionGap().y - 1;
        this.cell = objectReferer.getPosition();
        objectReferer.setUsed(this);
        this.animateMove(direction);
    }

    private static isHumanLeftLooking(direction: DIRECTION) {
        return ObjectOrientation.isHorizontalMirror(direction);
    }

    private static isHumanTopLooking(direction: DIRECTION) {
        return ObjectOrientation.isVerticalMirror(direction);
    }

    goToFreeCell(objectReferer: ObjectReferer) {
        objectReferer.setUnused();
        const cells = [];
        objectReferer.getEntries().forEach((direction) => {
            const tryCell = Direction.getNeighbor(this.cell, direction);
            if (this.worldKnowledge.isFree(tryCell)) {
                cells.push(tryCell);
            }
        });
        if (cells.length === 0) {
            console.log('oops');
            return;
        }
        this.path = [cells[Math.floor(Math.random() * cells.length)]];
        if (!this.moving) {
            this.popPath();
        }
    }

    loadAnimation(animation: ANIMATION, isLeftLooking: boolean = null, isTopLooking: boolean = null) {
        this.animationManager.loadAnimation(animation, isLeftLooking, isTopLooking);
    }

    isSelected(): boolean {
        return ObjectSelector.isSelected(this.sprite);
    }

    getSprite() {
        return this.sprite;
    }

    resetAStar(newNonEmptyCell: Point = null) {
        this.closestPathFinder.reset();
        if (newNonEmptyCell && this.path !== null) {
            // If human wants to go to a non-empty cell
            const matchingPath = this.path.filter((cell) => {
                return cell.equals(newNonEmptyCell)
            });
            if (matchingPath.length > 0) {
                const goal = this.path[this.path.length - 1];
                this.moveTo(goal);
                return;
            }
        }
    }

    resetStateIfCellEmpty(newEmptyCell: Point) {
        if (this.cell.equals(newEmptyCell)) {
            this.stateManager.reset(this.game);
        }
    }

    isFree(): boolean {
        return [STATE.MOVE_RANDOM, STATE.FREEZE, STATE.SMOKE, STATE.RAGE].indexOf(this.getStateType()) > -1;
    }

    getStateType(): STATE {
        return this.stateManager.getStateType();
    }

    getState(): HumanState {
        return this.stateManager.getState();
    }

    showTalkBubble(): void {
        this.talkBubble.show();
    }

    hideTalkBubble(): void {
        this.talkBubble.hide();
    }

    updateMoodFromState(): void {
        this.moodManager.updateFromState(this.getStateType());
    }

    getMood(mood: MOOD = null): number {
        if (mood === null) {
            return this.moodManager.getGeneralMood();
        }

        return this.moodManager.getMood(mood);
    }

    stopWalk() {
        this.path = null;
    }

    getMaxRetries(): number {
        return Math.ceil(MIN_RETRIES + (MAX_RETRIES - MIN_RETRIES) * this.humanProperties.getPerseverance());
    }

    getType(): EMPLOYEE_TYPE {
        return this.humanProperties.getType()
    }

    getName() {
        return this.humanProperties.getName();
    }

    showThoughtBubble(rageImage: RAGE_IMAGE) {
        this.thoughtBubble.showRage(rageImage);
    }

    hideThoughtBubble() {
        this.thoughtBubble.hide();
    }

    getNextProbabilities(): {[index: number]: number} {
        return this.stateManager.getNextProbabilities();
    }

    unselect() {
        if (this.isSelected()) {
            ObjectSelector.click(this.sprite, null, [this.sprite]);
        }
    }

    getRealWage(): Price {
        return this.humanProperties.getRealWage();
    }

    getMoveTime() {
        return this.path.length * this.getWalkDuration();
    }

    // pause() {
    //     this.animationManager.pause();
    // }
    //
    // resume() {
    //     this.animationManager.resume();
    // }

    select() {
        ObjectSelector.click(this.sprite, null, [this.sprite]);
    }

    getExperienceRatio() {
        return ((XP_MAX - XP_MIN) * this.humanProperties.getExperience() + XP_MIN);
    }
}
