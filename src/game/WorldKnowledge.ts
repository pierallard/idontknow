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
import {Depot} from "./objects/Depot";
import {DeletableObjectInterface} from "./objects/DeletableObjectInterface";
import {DIRECTION, Direction} from "./Direction";
import {HumanProperties} from "./human_stuff/HumanProperties";
import {MoodRegister} from "./human_stuff/MoodRegister";
import {MeetingTable} from "./objects/MeetingTable";
import {ObjectReferer} from "./objects/ObjectReferer";
import {LevelManager} from "./user_interface/LevelManager";
import {EMPLOYEE_TYPE} from "./human_stuff/HumanPropertiesFactory";
import {Price} from "./objects/Price";
import {ObjectDescription} from "./objects/ObjectDescription";
import {SmoothValue} from "./SmoothValue";
import {PANEL, UserInterface} from "./user_interface/UserInterface";
import {Couch} from "./objects/Couch";
import {EmployeeCountRegister} from "./human_stuff/EmployeeCountRegister";
import {Console} from "./objects/Console";
import {Floor} from "./Floor";
import {InfoBox} from "./user_interface/Infobox";
import {ObjectDescriptionRegistry} from "./objects/ObjectDescriptionRegistry";
import {EmployeeLevelRegister} from "./human_stuff/EmployeeLevelRegister";
import {Lamp} from "./objects/Lamp";
import {Printer} from "./objects/Printer";
import {Bonzai} from "./objects/Bonzai";
import {Point} from "./Point";

export const GRID_WIDTH = 37;
export const GRID_HEIGHT = 15;
export const GRID_FLOOR = 3;
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
    private employeeCountRegister: EmployeeCountRegister;
    private levelRegister: EmployeeLevelRegister;
    private levelManager: LevelManager;
    private wallet: SmoothValue;
    private userInterface: UserInterface;
    private floors: Floor[];
    private displayAmbiance: boolean;
    private infoboxes: InfoBox[];
    private gridCache: {index: number}[][][];
    private acceptableCache: number[][];

    constructor() {
        this.displayAmbiance = false;
        this.cells = [];
        this.objects = [];
        this.floors = [];
        this.wallRepository = new WallRepository();
        this.levelManager = new LevelManager();
        this.depot = new Depot();
        this.wallet = new SmoothValue(1500);
        this.infoboxes = [];
        this.gridCache = null;
        this.acceptableCache = null;

        const walls = ["" +
            "  XXXWXXXXXWXXWXXXXXXXWXXWXXXXXWXXX  \n" +
            "  X      X     D       X   X      X  \n" +
            "  W      D     X       XXDXX      W  \n" +
            "  X      XXXXXXX       D   D      X  \n" +
            "  X      X     XXXDXXXXXXXXX      X  \n" +
            "  X      X     X           X      X  \n" +
            "  W      X     X           X      W  \n" +
            "  X      X     X           D      X  \n" +
            "XXXXXXDXXX     D           XXXDXXXXXX\n" +
            "X X      D     X           D        X\n" +
            "X X      X     X           X        X\n" +
            "X X      XXWXXWXXXDXXXWXXWXX        X\n" +
            "X X      D                 D        X\n" +
            "X D      X                 X        X\n" +
            "XXXWXXXWXX                 XXWXXXWXXX",

            "         XXWXXWXXXXXXXWXXWXX         \n" +
            "         X   X    D    D   X         \n" +
            "         X   X    X    X   X         \n" +
            "         X   X    X    X   X         \n" +
            "         XXXDXDXXXX    X   X         \n" +
            "         X             X   X         \n" +
            "         XXXXXDXXXXXXXXXDXXX         \n" +
            "         X     D       X   X         \n" +
            "         X     X       X   X         \n" +
            "         X     X       X   X         \n" +
            "         X     X       D   X         \n" +
            "         XXWXXWXXXDXXXWXXWXX         \n" +
            "                                     \n" +
            "                                     \n" +
            "                                     ",

            "         XXXXXWXXXWXXXWXXXXX         \n" +
            "         X   X             X         \n" +
            "         X   X             X         \n" +
            "         X   X             X         \n" +
            "         XXXDX             X         \n" +
            "         W                 W         \n" +
            "         XXXXXDXXXXXXX     X         \n" +
            "         X     X     X     X         \n" +
            "         X     X     XXXXXXX         \n" +
            "         X     X     X     X         \n" +
            "         X     X     X     X         \n" +
            "         XXXXXWXXXWXXXWXXXXX         \n" +
            "                                     \n" +
            "                                     \n" +
            "                                     "];
        const floors = ["" +
            "  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  \n" +
            "  X,,,,,,,,,,,,,,,,,,,,,...........  \n" +
            "  X,,,,,,,,,,,,,,,,,,,,,...........  \n" +
            "  X,,,,,,,,,,,,,,,,,,,,,...........  \n" +
            "  X,,,,,,,.....,,,,,,,,,...........  \n" +
            "  X,,,,,,,.........................  \n" +
            "  X,,,,,,,.........................  \n" +
            "  X,,,,,,,.........................  \n" +
            "XXX,,,,,,,.........................XX\n" +
            "X....................................\n" +
            "X....................................\n" +
            "X....................................\n" +
            "X.........,,,,,,,,,,,,,,,,,,.........\n" +
            "X.........,,,,,,,,,,,,,,,,,,.........\n" +
            "X.........,,,,,,,,,,,,,,,,,,.........",

            "                                     \n" +
            "          ..................         \n" +
            "          ..........    ....         \n" +
            "          ..........    ....         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ,,,,,,,,,,,,,,,,,,         \n" +
            "          ,,,,,,,,,,,,,,,,,,         \n" +
            "          ,,,,,,,,,,,,,,,,,,         ",

            "                                     \n" +
            "              ..............         \n" +
            "              ..............         \n" +
            "              ..............         \n" +
            "              ..............         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "          ..................         \n" +
            "                                     \n" +
            "                                     \n" +
            "                                     "];

        for (let i = 0; i < walls.length; i++) {
            const wallLines = walls[i].split("\n");
            const floorLines = floors[i].split("\n");
            for (let y = 0; y < GRID_HEIGHT; y++) {
                let wallLine = wallLines[wallLines.length - 1 - y];
                let floorLine = floorLines[floorLines.length - 1 - y];
                if (wallLine === undefined) {
                    wallLine = Array(wallLines[0].length).join(' ');
                }
                if (floorLine === undefined) {
                    floorLine = Array(wallLines[0].length).join(' ');
                }
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const wallCell = wallLine[wallLine.length - 1 - x];
                    const floorCell = floorLine[floorLine.length - 1 - x];
                    if (floorCell !== ' ') {
                        this.cells.push(new Cell(this, new Point(x, y, i)));
                    }
                    if (floorCell === '.') {
                        this.floors.push(new Floor(new Point(x, y, i), 'woodcell'));
                    } else if (floorCell === ',') {
                        this.floors.push(new Floor(new Point(x, y, i), 'case_floortile'));
                    }
                    if (wallCell === 'X') {
                        this.wallRepository.addWall(new Point(x, y, i));
                    } else if (wallCell === 'W') {
                        this.wallRepository.addWindow(new Point(x, y, i));
                    } else if (wallCell === 'D') {
                        this.wallRepository.addDoor(new Point(x, y, i));
                    }
                }
            }
        }

        this.humanRepository = new HumanRepository(this);
        this.moodRegister = new MoodRegister(this.humanRepository);
        this.employeeCountRegister = new EmployeeCountRegister(this.humanRepository);
        this.levelRegister = new EmployeeLevelRegister(this.levelManager);
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        this.game = game;
        this.groups = groups;
        this.wallet.create(game);
        this.levelManager.create(game);

        this.floors.forEach((floors: Floor) => {
            floors.create(game, groups);
        });

        this.cells.forEach((cell: Cell) => {
            cell.create(game, groups);
        });

        this.objects.forEach((object: ObjectInterface) => {
            object.create(game, groups);
        });

        this.wallRepository.create(game, groups);
        this.humanRepository.create(game, groups, this);
        this.moodRegister.create(game);
        this.employeeCountRegister.create(game);
        this.levelRegister.create(game);
    }

    update() {
        this.wallet.update();
        this.humanRepository.update();
        if (this.levelManager.update()) {
            this.addMoneyInWallet(this.levelManager.getEarnedMoney());
            this.displayLevelInfoBox();
        }
        this.cells.forEach((cell) => {
            cell.update();
        });
        this.wallRepository.update();


        for (let i = 0; i < this.infoboxes.length; i++) {
            if (this.infoboxes[i].isVisible()) {
                this.infoboxes[i].update();
            } else {
                this.infoboxes.splice(i, 1);
                i--;
            }
        }
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

    resetAStar(position: Point = null) {
        this.acceptableCache = null;
        this.humanRepository.humans.forEach((human) => {
            human.resetAStar(position);
        });
    }

    resetStates(positions: Point[]) {
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

    getAnotherFreeHumans(human: Employee, max: number = 1): Employee[] {
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

    getRandomCell(): Point {
        const acceptableIndexes = this.getAcceptables(0);
        const random = Math.floor(Math.random() * acceptableIndexes.length);

        return this.cells[acceptableIndexes[random]].getPosition();
    }

    getAcceptables(floor: number): number[] {
        if (this.acceptableCache === null) {
            this.acceptableCache = [];
            for (let i = 0; i < GRID_FLOOR; i++) {
                this.acceptableCache[i] = [];
                for (let j = 0; j < this.cells.length; j++) {
                    if (this.cells[j].getPosition().z === i) {
                        if (this.isFree(this.cells[j].getPosition())) {
                            this.acceptableCache[i].push(j);
                        }
                    }
                }
            }
        }

        return this.acceptableCache[floor];
    }

    getMeetingCells(cells: Point[]) {
        const acceptableIndexes = this.getAcceptables(0);
        let result = null;
        let dist = null;
        for (let i = 0; i < acceptableIndexes.length; i++) {
            const position1 = this.cells[acceptableIndexes[i]].getPosition();
            for (let j = i + 1; j < acceptableIndexes.length; j++) {
                const position2 = this.cells[acceptableIndexes[j]].getPosition();
                if (PositionTransformer.isNeighbor(position1, position2)) {
                    const newDist = WorldKnowledge.getMeetingPointDistance(cells, position1);
                    if (result === null || newDist < dist) {
                        dist = newDist;
                        result = [position1, position2];
                    }
                }
            }
        }

        return result;
    }

    getGrid(floor: number): {index: number}[][] {
        if (this.gridCache === null) {
            this.gridCache = [];
            for (let i = 0; i < GRID_FLOOR; i++) {
                this.gridCache[i] = [];
                for (let j = 0; j < this.cells.length; j++) {
                    if (this.cells[j].getPosition().z === i) {
                        if (undefined === this.gridCache[i][this.cells[j].getPosition().y]) {
                            this.gridCache[i][this.cells[j].getPosition().y] = [];
                        }
                        this.gridCache[i][this.cells[j].getPosition().y][this.cells[j].getPosition().x] = {
                            index: j
                        };
                    }
                }
            }
        }

        return this.gridCache[floor];
    }

    isFree(point: Point, object: ObjectInterface = null): boolean {
        if (point.x < 0 || point.y < 0 || point.x >= GRID_WIDTH || point.y >= GRID_HEIGHT) {
            return false;
        }

        for (let j = 0; j < this.objects.length; j++) {
            for (let k = 0; k < this.objects[j].getPositions().length; k++) {
                if (this.objects[j].getPositions()[k].equals(point) &&
                    this.objects[j] !== object) {
                    return false;
                }
            }
        }

        if (this.wallRepository.hasWall(point, false)) {
            return false;
        }

        return true;
    }

    getClosestReferer(types: string[], referersCountPerObject: number = 1, position: Point = null): ObjectReferer {
        let freeReferers: ObjectReferer[] = [];
        this.objects.forEach((object) => {
            if (types.indexOf(object.getName()) > -1) {
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

    private static getMeetingPointDistance(sources: Point[], point: Point): number {
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

    canPutHere(objectInfo: ObjectDescription, origin: Point, orientation: DIRECTION) {
        return this.areAllTheCellsFree(objectInfo, origin, orientation) &&
            this.areAllSpritesEnterable(objectInfo, origin, orientation) &&
            this.isNewObjectNotBlockingExistingOne(objectInfo, origin, orientation);
    };

    private areAllTheCellsFree(objectInfo: ObjectDescription, origin: Point, orientation: DIRECTION) {
        for (let i = 0; i < objectInfo.getSpriteInfos(orientation).length; i++) {
            const spriteInfo = objectInfo.getSpriteInfo(orientation, i);
            const gap = spriteInfo.getCellOffset(orientation);
            if (!this.isFree(origin.add(gap))) {
                return false;
            }
        }

        return true;
    }

    private areAllSpritesEnterable(objectInfo: ObjectDescription, origin: Point, orientation: DIRECTION) {
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

    private isNewObjectNotBlockingExistingOne(objectInfo: ObjectDescription, origin: Point, orientation: DIRECTION) {
        const cellOffsets = objectInfo.getUniqueCellOffsets(orientation);
        const cellPositions = cellOffsets.map((offset) => {
            return new PIXI.Point(
                origin.x + offset.x,
                origin.y + offset.y
            );
        });
        for (let o = 0; o < this.objects.length; o++) {
            const object = this.objects[o];
            const objectInfo = object.getDescription();
            const interactivePoints = objectInfo.getInteractivePoints(object.getOrientation());
            for (let i = 0; i < interactivePoints.length; i++) {
                const cellOffset = interactivePoints[i].getCellOffset(object.getOrientation());
                const cell = object.getOrigin().add(cellOffset);
                const entryPoints = interactivePoints[i].getEntryPoints(object.getOrientation());
                let isEntryPossible = false;
                for (let j = 0; j < entryPoints.length; j++) {
                    const entryCell = Direction.getNeighbor(cell, entryPoints[j]);
                    if (this.isFree(entryCell)) {
                        let isNewObjectNotBlockingThisEntry = true;
                        cellPositions.forEach((cellPosition) => {
                            if (cellPosition.x === entryCell.x && cellPosition.y === entryCell.y) {
                                isNewObjectNotBlockingThisEntry = false;
                            }
                        });
                        isEntryPossible = isEntryPossible || isNewObjectNotBlockingThisEntry;
                    }
                }
                if (isEntryPossible === false) {
                    return false;
                }
            }
        }

        return true;
    }

    isEntryAccessibleForObject(origin: Point, gap: PIXI.Point, entry: DIRECTION) {
        const gappedPosition = origin.add(gap);

        return this.isFree(Direction.getNeighbor(gappedPosition, entry));
    }

    add(name: string, position: Point, orientation: DIRECTION) {
        let object: InteractiveObjectInterface = null;
        switch (name) {
            case 'Desk': object = new Desk(position, this, orientation); break;
            case 'Sofa': object = new Sofa(position, this, orientation); break;
            case 'Dispenser': object = new Dispenser(position, this, orientation); break;
            case 'Meeting Table': object = new MeetingTable(position, this, orientation); break;
            case 'Couch': object = new Couch(position, this, orientation); break;
            case 'Console': object = new Console(position, this, orientation); break;
            case 'Lamp': object = new Lamp(position, this, orientation); break;
            case 'Printer': object = new Printer(position, this, orientation); break;
            case 'Bonzai': object = new Bonzai(position, this, orientation); break;
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

    addProgress(employee: Employee, value: number, time: number) {
        this.levelManager.addLevelProgress(employee.getType(), value, time);
        if (employee.getType() === EMPLOYEE_TYPE.SALE) {
            this.addMoneyInWallet(new Price(value * this.levelManager.getSoftwarePrice().getValue()), time);
        }
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

    getSoftwarePrice(): Price {
        return this.levelManager.getSoftwarePrice();
    }

    getEmployeeCount(type: EMPLOYEE_TYPE): number {
        return this.humanRepository.getCount(type);
    }

    getLastEmployeesCount(): number[][] {
        return this.employeeCountRegister.getLastCounts();
    }

    getLastEmployeesLevel(): number[][] {
        return this.levelRegister.getLastCounts();
    }

    // pause() {
    //     this.humanRepository.humans.forEach((human) => {
    //         human.pause();
    //     });
    // }
    //
    // resume() {
    //     this.humanRepository.humans.forEach((human) => {
    //         human.resume();
    //     });
    // }

    getSelectedHumanSprite() {
        for (let i = 0; i < this.humanRepository.humans.length; i++) {
            if (this.humanRepository.humans[i].isSelected()) {
                return this.humanRepository.humans[i].getSprite();
            }
        }

        return null;
    }

    selectFirstHuman() {
        this.humanRepository.humans[0].select();
    }

    private displayLevelInfoBox() {
        let strings = [
            '- ' + this.levelManager.getGoal(EMPLOYEE_TYPE.DEVELOPER) + ' lines to code',
            '- ' + this.levelManager.getGoal(EMPLOYEE_TYPE.SALE) + ' licences to sell',
        ];
        if (this.levelManager.getGoal(EMPLOYEE_TYPE.MARKETING) > 0) {
            strings.push('- ' + this.levelManager.getGoal(EMPLOYEE_TYPE.MARKETING) + ' campaigns to to');
        }
        let availables = [];
        if (this.getLevel() === 2) {
            availables.push('- Sales employees');
        }
        if (this.getLevel() === 3) {
            availables.push('- Marketing employees');
        }
        ObjectDescriptionRegistry.getSalableObjects(this.getLevel()).forEach((objectDescription) => {
            if (objectDescription.getMinLevel() === this.getLevel()) {
                availables.push('- ' + objectDescription.getName())
            }
        });

        let text = [
            'Congratulations! You reached the level ' + this.getLevel() + '!',
            'Next goals:'
        ].concat(strings);
        if (availables.length > 0) {
            text = text.concat([
                '',
                'Now available:'
            ]).concat(availables);
        }
        const infoBox = new InfoBox(
            'Next level!',
            text,
            'Oh yeah!'
        );
        infoBox.create(this.game, this.groups);
        this.infoboxes.push(infoBox);
    }

    getHumanCount() {
        return this.humanRepository.humans.length;
    }

    getAmbiance(cell: Point): number {
        let result = 1;
        this.objects.forEach((object) => {
            let ambiance = object.getDescription().getAmbiance();
            if (ambiance) {
                let distance = Math.sqrt(
                    (cell.x - object.getOrigin().x) * (cell.x - object.getOrigin().x) +
                    (cell.y - object.getOrigin().y) * (cell.y - object.getOrigin().y)
                );
                let maxDistance = object.getDescription().getRadius();
                if (distance < maxDistance) {
                    result += ambiance * (maxDistance - distance) / maxDistance;
                }
            }
        });

        return Math.min(2, Math.max(0, result));
    }

    getAmbianceDisplayed(): boolean {
        return this.displayAmbiance;
    }

    setAmbianceDisplayed(value: boolean): void {
        this.displayAmbiance = value;
    }

    initializeInfoBox() {
        const infobox = new InfoBox(
            'Welcome!', [
                'Welcome to Office Tycoon!',
                '',
                'You are in charge of the recruitment to run',
                'your business.',
                'Complete your goals for each level and you will',
                'gain new people, new objects for your employees!',
                'Be careful of the health of your employees, the',
                'better they are, the better they work.'
            ], 'OK, let\'s go!');
        infobox.create(this.game, this.groups);
        this.infoboxes.push(infobox);
    }
}
