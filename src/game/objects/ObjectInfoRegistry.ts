import {ObjectInfo} from "./ObjectInfo";
import {SpriteInfo} from "./SpriteInfo";
import {DIRECTION} from "../Direction";
import {Dispenser} from "./Dispenser";
import {Sofa} from "./Sofa";
import {Desk} from "./Desk";
import {Price} from "./Price";

export class ObjectInfoRegistry {
    private static objectInfos: ObjectInfo[] = null;

    static getObjectInfo(name: string): ObjectInfo {
        if (this.objectInfos === null) {
            this.generateObjectInfos();
        }

        for (let i = 0; i < this.objectInfos.length; i++) {
            if (this.objectInfos[i].getName() === name) {
                return this.objectInfos[i];
            }
        }

        throw "Impossible to find info for " + name;
    }

    private static generateObjectInfos() {
        this.objectInfos = [];
        this.objectInfos.push(new ObjectInfo(
            'Dispenser',
            [
                new SpriteInfo('dispenser', 4, -4, 3, -13)
            ],
            [DIRECTION.BOTTOM],
            new Price(70)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Sofa',
            [
                new SpriteInfo('sofa', 0, -8, 3, 0)
            ],
            [DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM],
            new Price(10)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Desk',
            [
                new SpriteInfo('chair', -10, -8, 5, 0),
                new SpriteInfo('desk', 0, 0, 4, 0)
            ],
            [DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT],
            new Price(20)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Table',
            [
                new SpriteInfo('chair2', -8, -9, 5, 0),
                new SpriteInfo('table', 0, 0, 4, 0)
            ],
            [DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT]
        ));
    }

    static getSellableObjects(): ObjectInfo[] {
        if (this.objectInfos === null) {
            this.generateObjectInfos();
        }

        return this.objectInfos;
    }
}