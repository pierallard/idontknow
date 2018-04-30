import {HumanRepository} from "./repositories/HumanRepository";
import {Wall} from "./objects/Wall";
import {Sofa} from "./objects/Sofa";
import {InteractiveObjectInterface} from "./objects/InteractiveObjectInterface";
import {ObjectInterface} from "./objects/ObjectInterface";
import {Employee} from "./human_stuff/Employee";
import {Desk} from "./objects/Desk";
import {Dispenser} from "./objects/Dispenser";
import {WallRepository} from "./repositories/WallRepository";
import {Cell} from "./Cell";
import {PositionTransformer} from "./PositionTransformer";
import {GROUP_FLOOR, GROUP_OBJECTS_AND_HUMANS} from "./game_state/Play";
import {Depot} from "./objects/Depot";
import {DeletableObjectInterface} from "./objects/DeletableObjectInterface";
import {DIRECTION, Direction} from "./Direction";
import {HumanProperties} from "./human_stuff/HumanProperties";
import {MoodRegister} from "./human_stuff/MoodRegister";
import {Table} from "./objects/Table";
import {ObjectReferer} from "./objects/ObjectReferer";
import {LevelManager} from "./LevelManager";
import {EMPLOYEE_TYPE} from "./human_stuff/HumanPropertiesFactory";
import {Price} from "./objects/Price";
import {ObjectDescription} from "./objects/ObjectDescription";
import {ObjectDescriptionRegistry} from "./objects/ObjectDescriptionRegistry";
import {SmoothValue} from "./SmoothValue";
import {PANEL, UserInterface} from "./user_interface/UserInterface";
import {DIRECTION_LOOP} from "./objects/ObjectOrientation";
import {Couch} from "./objects/Couch";

export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 16;
export const DEBUG_WORLD = false;

export class WorldKnowledge {
    private humanRepository: HumanRepository;
    private cells: Cell[];
    private objects: InteractiveObjectInterface[];
    private wallRepository: WallRepository;
    private depot: Depot;
    private game: Phaser.Game;
    private groups: {[index: string] : Phaser.Group};
    private moodRegister: MoodRegister;
    private levelManager: LevelManager;
    private wallet: SmoothValue;
    private userInterface: UserInterface;

    constructor() {
        this.cells = [];
        this.objects = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.cells.push(new Cell(new PIXI.Point(x, y)));
            }
        }
        this.wallRepository = new WallRepository();
        this.levelManager = new LevelManager();
        this.depot = new Depot();
        this.wallet = new SmoothValue(1000);

        if (DEBUG_WORLD) {
            this.wallRepository.addWall(new PIXI.Point(5, 5));
            this.wallRepository.addWall(new PIXI.Point(6, 5));
            this.objects.push(new Desk(new PIXI.Point(4, 5), this, DIRECTION_LOOP[0]));
            this.objects.push(new Desk(new PIXI.Point(4, 6), this, DIRECTION_LOOP[0]));
            this.objects.push(new Dispenser(new PIXI.Point(5, 4), this, DIRECTION_LOOP[0]));
        } else {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.wallRepository.addWall(new PIXI.Point(x, 0));
                this.wallRepository.addWall(new PIXI.Point(x, GRID_HEIGHT - 1));
            }
            for (let y = 1; y < (GRID_HEIGHT - 1); y++) {
                this.wallRepository.addWall(new PIXI.Point(0, y));
                this.wallRepository.addWall(new PIXI.Point(GRID_WIDTH - 1, y));
            }
            for (let x = 1; x < 3 - 1; x++) {
                this.wallRepository.addWall(new PIXI.Point(x, GRID_WIDTH / 2 + 1));
            }
            for (let x = 5; x < GRID_WIDTH - 1; x++) {
                this.wallRepository.addWall(new PIXI.Point(x, GRID_WIDTH / 2 + 1));
            }
            [
                new PIXI.Point(4, 3),
                new PIXI.Point(4, 4),
                new PIXI.Point(3, 4),
                new PIXI.Point(3, 3),
            ].forEach((cell) => {
                this.wallRepository.addWall(cell);
            });
        }

        this.humanRepository = new HumanRepository(this);
        this.moodRegister = new MoodRegister(this.humanRepository);
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.groups = groups;
        const floor = groups[GROUP_FLOOR];
        const noname = groups[GROUP_OBJECTS_AND_HUMANS];

        this.cells.forEach((cell: Cell) => {
            cell.create(game, floor);
        });

        this.objects.forEach((object: ObjectInterface) => {
            object.create(game, groups);
        });

        this.wallRepository.create(game, noname);
        this.humanRepository.create(game, groups, this);
        this.moodRegister.create(game);
    }

    update() {
        this.humanRepository.update();
        this.levelManager.update();
    }

    humanMoved(positions: PIXI.Point[]) {
        const walls = this.wallRepository.getWalls();

        walls.forEach((wall: Wall) => {
            let visible = true;
            positions.forEach((position: PIXI.Point) => {
                if (this.anyHumanIsAboveWall(wall)) {
                    visible = false;
                }
            });
            wall.setVisibility(visible);
        })
    }

    private anyHumanIsAboveWall(wall: Wall) {
        const humans = this.humanRepository.humans;
        for (let i = 0; i < humans.length; i++) {
            if (WorldKnowledge.humanIsAboveWall(humans[i].getPosition(), wall)) {
                return true;
            }
        }

        return false;
    }

    private static humanIsAboveWall(humanPosition, wall: Wall) {
        const wallPosition = wall.getPosition();

        return (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x && humanPosition.y == wallPosition.y + 1) ||
            (humanPosition.x == wallPosition.x + 1 && humanPosition.y == wallPosition.y);
    }

    getMoneyInWallet(): Price {
        return new Price(this.wallet.getValue());
    }

    resetAStar(position: PIXI.Point) {
        this.humanRepository.humans.forEach((human) => {
            human.resetAStar(position);
        });
    }

    resetStates(positions: PIXI.Point[]) {
        this.humanRepository.humans.forEach((human) => {
            positions.forEach((position) => {
                human.resetStateIfCellEmpty(position);
            });
        });
    }

    getAnotherFreeHuman(human: Employee): Employee {
        const freeHuman = this.getAnotherFreeHumans(human, 1);
        if (freeHuman.length == 0) {
            return null;
        }

        return freeHuman[0];
    }

    getAnotherFreeHumans(human: Employee, max: number): Employee[] {
        let availableHumans = this.humanRepository.humans.filter((anotherHuman: Employee) => {
            return anotherHuman !== human && anotherHuman.isFree()
        });

        if (availableHumans.length === 0) {
            return [];
        }

        availableHumans = availableHumans.sort(() => {
            return Math.random() - 0.5;
        });

        let result = [];
        for (let i = 0; i < max; i++) {
            if (availableHumans[i] !== undefined) {
                result.push(availableHumans[i]);
            }
        }
        return result;
    }

    getRandomCell(): PIXI.Point {
        const acceptableIndexes = this.getAcceptables();
        const random = Math.floor(Math.random() * acceptableIndexes.length);

        return this.cells[acceptableIndexes[random]].getPosition();
    }

    getAcceptables(): number[] {
        let acceptables = [];
        for (let i = 0; i < this.cells.length; i++) {
            if (this.isFree(this.cells[i].getPosition())) {
                acceptables.push(i);
            }
        }

        return acceptables;
    }

    getMeetingCells(cells: PIXI.Point[]) {
        const acceptableIndexes = this.getAcceptables();
        let result = null;
        let dist = null;
        for (let i = 0; i < acceptableIndexes.length; i++) {
            const position1 = this.cells[acceptableIndexes[i]].getPosition();
            for (let j = i + 1; j < acceptableIndexes.length; j++) {
                const position2 = this.cells[acceptableIndexes[j]].getPosition();
                if (PositionTransformer.isNeighbor(position1, position2)) {
                    const newDist = WorldKnowledge.getDist(cells, position1);
                    if (result === null || newDist < dist) {
                        dist = newDist;
                        result = [position1, position2];
                    }
                }
            }
        }

        return result;
    }

    getGrid(): {index: number}[][] {
        let grid = [];
        for (let i = 0; i < this.cells.length; i++) {
            if (undefined === grid[this.cells[i].getPosition().y]) {
                grid[this.cells[i].getPosition().y] = [];
            }
            grid[this.cells[i].getPosition().y][this.cells[i].getPosition().x] = {
                index: i
            };
        }

        return grid;
    }

    isFree(point: PIXI.Point, object: ObjectInterface = null): boolean {
        if (point.x < 0 || point.y < 0 || point.x >= GRID_WIDTH || point.y >= GRID_HEIGHT) {
            return false;
        }

        for (let j = 0; j < this.objects.length; j++) {
            for (let k = 0; k < this.objects[j].getPositions().length; k++) {
                if (this.objects[j].getPositions()[k].x === point.x &&
                    this.objects[j].getPositions()[k].y === point.y &&
                    this.objects[j] !== object) {
                    return false;
                }
            }
        }

        if (this.wallRepository.hasWall(point.x, point.y)) {
            return false;
        }

        return true;
    }

    getClosestReferer(types: string[], referersCountPerObject: number = 1, position: PIXI.Point = null) {
        let freeReferers: ObjectReferer[] = [];
        this.objects.forEach((object) => {
            if (types.indexOf(object.constructor.name) > -1) {
                const unusedReferers = object.getUnusedReferers();
                if (unusedReferers.length >= referersCountPerObject) {
                    freeReferers = freeReferers.concat(unusedReferers);
                }
            }
        });
        if (freeReferers.length === 0) {
            return null;
        }

        if (position === null) {
            return freeReferers[Math.floor(Math.random() * freeReferers .length)];
        }

        return freeReferers.sort((referer1, referer2) => {
            return PositionTransformer.dist(position, PositionTransformer.getCentroid([referer1.getPosition()]))
                - PositionTransformer.dist(position, PositionTransformer.getCentroid([referer2.getPosition()]));
        })[0];
    }

    private static getDist(sources: PIXI.Point[], point: PIXI.Point): number {
        let dist = 0;
        sources.forEach((source) => {
            dist += PositionTransformer.dist(source, point);
        });

        return dist;
    }

    moveToDepot(object: DeletableObjectInterface) {
        this.resetStates(object.getPositions());
        const index = this.objects.indexOf(object, 0);
        if (index > -1) {
            this.objects.splice(index, 1);
        } else {
            throw "Impossible to delete the object!";
        }
        this.depot.add(object.constructor.name);
    }

    getDepot(): Depot {
        return this.depot;
    }

    buy(objectName: string, price: Price) {
        this.depot.add(objectName);
        this.wallet.add(- price.getValue());
    }

    canPutHere(objectInfo: ObjectDescription, origin: PIXI.Point, orientation: DIRECTION) {
        return this.areAllTheCellsFree(objectInfo, origin, orientation) &&
            this.areAllSpritesEnterable(objectInfo, origin, orientation) &&
            this.isNewObjectNotBlockingExistingOne(origin);
    };

    private areAllTheCellsFree(objectInfo: ObjectDescription, origin: PIXI.Point, orientation: DIRECTION) {
        for (let i = 0; i < objectInfo.getSpriteInfos(orientation).length; i++) {
            const spriteInfo = objectInfo.getSpriteInfo(orientation, i);
            const gap = spriteInfo.getCellOffset(orientation);
            if (!this.isFree(new PIXI.Point(origin.x + gap.x, origin.y + gap.y))) {
                return false;
            }
        }

        return true;
    }

    private areAllSpritesEnterable(objectInfo: ObjectDescription, origin: PIXI.Point, orientation: DIRECTION) {
        for (let i = 0; i < objectInfo.getInteractivePoints(orientation).length; i++) {
            const interactivePoint = objectInfo.getInteractivePoints(orientation)[i];
            let isEntryPossible = false;
            interactivePoint.getEntryPoints(orientation).forEach((entry) => {
                const gap = interactivePoint.getCellOffset(orientation);
                isEntryPossible = isEntryPossible || this.isEntryAccessibleForObject(origin, gap, entry)
            });
            if (isEntryPossible === false) {
                return false;
            }
        }

        return true;
    }

    private isNewObjectNotBlockingExistingOne(origin: PIXI.Point) {
        for (let o = 0; o < this.objects.length; o++) {
            /* TODO This method is buggy, it does not take account every entry points. I have to parse sprite by sprite
             * and check it's not blocking for every sprite, instead of looking if there is a unique entry point.
             */
            const object = this.objects[o];
            const objectInfo = ObjectDescriptionRegistry.getObjectDescription(object.constructor.name);

            let isEntryPossible = false;
            const entryCells = objectInfo.getEntryCells(object.getOrigin(), object.getOrientation());
            for (let i = 0; i < entryCells.length; i++) {
                isEntryPossible = isEntryPossible || (this.isFree(entryCells[i]) && (entryCells[i].x !== origin.x || entryCells[i].y !== origin.y));
            }
            if (isEntryPossible === false) {
                return false;
            }
        }

        return true;
    }

    isEntryAccessibleForObject(origin: PIXI.Point, gap: PIXI.Point, entry: DIRECTION) {
        const gappedPosition = new PIXI.Point(
            origin.x + gap.x,
            origin.y + gap.y,
        );

        return this.isFree(Direction.getNeighbor(gappedPosition, entry));
    }

    add(name: string, position: PIXI.Point, orientation: DIRECTION) {
        let object: InteractiveObjectInterface = null;
        switch (name) {
            case 'Desk': object = new Desk(position, this, orientation); break;
            case 'Sofa': object = new Sofa(position, this, orientation); break;
            case 'Dispenser': object = new Dispenser(position, this, orientation); break;
            case 'Table': object = new Table(position, this, orientation); break;
            case 'Couch': object = new Couch(position, this, orientation); break;
            default: throw 'Unknown object ' + name;
        }
        this.objects.push(object);
        object.create(this.game, this.groups);
        this.resetAStar(position);
    }

    addEmployee(humanProperties: HumanProperties) {
        const employee = new Employee(this.getRandomCell(), humanProperties);
        employee.create(this.game, this.groups, this);
        this.humanRepository.humans.push(employee);
    }

    getLastMoods(): number[] {
        return this.moodRegister.getLastMoods();
    }

    hasObject(interactiveObject: InteractiveObjectInterface) {
        return this.objects.indexOf(interactiveObject) > -1;
    }

    getLevelProgress(type: EMPLOYEE_TYPE): number {
        return this.levelManager.getLevelProgress(type);
    }

    addProgress(type: EMPLOYEE_TYPE, value: number, time: number) {
        this.levelManager.addLevelProgress(type, value, time);
    }

    addMoneyInWallet(price: Price, milliseconds: number = Phaser.Timer.SECOND) {
        this.wallet.add(price.getValue(), milliseconds);
    }

    setSelectedHuman(employee: Employee) {
        this.userInterface.setSelectedHuman(employee);
        this.humanRepository.humans.forEach((human) => {
            if (human !== employee) {
                human.unselect();
            }
        });
    }

    setUserInterface(userInterface: UserInterface) {
        this.userInterface = userInterface;
    }

    unselectHuman(switchPanel: boolean = true) {
        if (switchPanel) {
            this.userInterface.selectPanel(PANEL.INFO);
        }
        this.humanRepository.humans.forEach((human) => {
            human.unselect();
        })
    }

    getLevelValue(type: EMPLOYEE_TYPE): number {
        return this.levelManager.getLevelValue(type);
    }

    getLevelGoal(type: EMPLOYEE_TYPE): number {
        return this.levelManager.getGoal(type);
    }

    getLevel(): number {
        return this.levelManager.getLevel();
    }
}
