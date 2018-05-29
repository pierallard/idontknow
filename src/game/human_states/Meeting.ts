import {Employee} from "../human_stuff/Employee";
import {WorldKnowledge} from "../WorldKnowledge";
import {STATE} from "../human_stuff/HumanStateManager";
import {Point} from "../Point";

export class Meeting {
    private time: number;
    private places: {human:Employee, position: Point}[];

    constructor(humans: Employee[], time: number, worldKnowledge: WorldKnowledge) {
        const cells = worldKnowledge.getMeetingCells(humans.map((human) => {
            return human.getPosition();
        }));
        if (cells === null) {
            throw 'No meeting point found!';
        }
        this.time = time;
        this.places = [];
        for (let i = 0; i < cells.length; i++) {
            this.places.push({
                human: humans[i],
                position: cells[i]
            });
        }
    }

    getCell(human: Employee): Point {
        for (let i = 0; i < this.places.length; i++) {
            if (human === this.places[i].human) {
                return this.places[i].position;
            }
        }

        return null;
    }

    isReady() {
        for (let i = 0; i < this.places.length; i++) {
            const human = this.places[i].human;
            const position = this.places[i].position;
            if (human.isMoving() || human.getPosition().x !== position.x || human.getPosition().y !== position.y) {
                return false;
            }
        }
        return true;
    }

    getTime(): number {
        return this.time;
    }

    getAnotherHuman(human: Employee): Employee {
        let anotherHumans = [];
        this.places.forEach((place) => {
            if (place.human !== human) {
                anotherHumans.push(place.human);
            }
        });

        return anotherHumans[Math.floor(Math.random() * anotherHumans.length)];
    }

    areAllHumanStillInMeeting() {
        for (let i = 0; i < this.places.length; i++) {
            const human = this.places[i].human;
            if (human.getStateType() !== STATE.TALK) {
                return false;
            }
        }

        return true;
    }
}
