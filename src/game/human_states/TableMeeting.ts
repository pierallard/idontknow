import {Employee} from "../human_stuff/Employee";
import {ObjectReferer} from "../objects/ObjectReferer";
import {Table} from "../objects/Table";
import {STATE} from "../human_stuff/HumanStateManager";

export class TableMeeting {
    private time: number;
    private places: {human:Employee, position: ObjectReferer}[];
    private table: Table;

    constructor(humans: Employee[], time: number, table: Table) {
        this.time = time;
        this.places = [];
        this.table = table;
        let unusedReferers = table.getUnusedReferers();
        if (unusedReferers.length < humans.length) {
            debugger;
        }
        for (let i = 0; i < unusedReferers.length; i++) {
            this.places.push({
                human: humans[i],
                position: unusedReferers[i]
            });
        }
        console.log('Places count : ' + this.places.length);
    }

    getCell(human: Employee): ObjectReferer {
        for (let i = 0; i < this.places.length; i++) {
            if (human === this.places[i].human) {
                return this.places[i].position;
            }
        }

        debugger;
        throw 'No cell found for this human!';
    }

    isReady() {
        for (let i = 0; i < this.places.length; i++) {
            const human = this.places[i].human;
            const position = this.places[i].position.getPosition();
            if (human.isMoving() || human.getPosition().x !== position.x || human.getPosition().y !== position.y) {
                return false;
            }
        }
        return true;
    }

    getTime(): number {
        return this.time;
    }

    getAnotherHumans(human: Employee): Employee[] {
        let anotherHumans = [];
        this.places.forEach((place) => {
            if (place.human !== human) {
                anotherHumans.push(place.human);
            }
        });

        return anotherHumans;
    }

    areAllHumanStillInMeeting() {
        for (let i = 0; i < this.places.length; i++) {
            const human = this.places[i].human;
            if (human.getState() !== STATE.SIT_TALK) {
                return false;
            }
        }

        return true;
    }

    getTable(): Table {
        return this.table;
    }
}
