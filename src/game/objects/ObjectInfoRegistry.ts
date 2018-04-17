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
                new SpriteInfo('dispenser', [DIRECTION.BOTTOM], 4, -4, 3, -13)
            ],
            new Price(70)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Sofa',
            [
                new SpriteInfo('sofa', [DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM], 0, -8, 3, 0)
            ],
            new Price(10)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Desk',
            [
                new SpriteInfo('chair', [DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT], -10, -8, 5, 0),
                new SpriteInfo('desk', [],0, 0, 4, 0)
            ],
            new Price(20)
        ));
        this.objectInfos.push(new ObjectInfo(
            'Table',
            [
                new SpriteInfo('chair2', [DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT], -8, -9, 5, 0),
                new SpriteInfo('table', [], 0, 0, 4, 0)
            ],
            new Price(12)
        ));
    }

    static getSellableObjects(): ObjectInfo[] {
        if (this.objectInfos === null) {
            this.generateObjectInfos();
        }

        return this.objectInfos;
    }
}
