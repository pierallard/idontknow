import {Stairs} from "../objects/Stairs";

export class StairsRepository {
    private stairs: Stairs[];

    constructor() {
        this.stairs = [];
    }

    add(stairs: Stairs) {
        this.stairs.push(stairs);
    }

    getStairsAt(z: number): Stairs {
        for (let i = 0; i < this.stairs.length; i++) {
            if (this.stairs[i].getStartFloor() === z) {
                return this.stairs[i];
            }
        }

        throw 'Impossible to get stairs at level ' + z;
    }
}
