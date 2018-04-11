import {ObjectInfo} from "./ObjectInfo";
import {SpriteInfo} from "./SpriteInfo";
import {DIRECTION} from "../Direction";

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
                new SpriteInfo('dispenser', 4, -4, 3)
            ],
            [DIRECTION.BOTTOM]
        ));
        this.objectInfos.push(new ObjectInfo(
            'Sofa',
            [
                new SpriteInfo('sofa', 0, -8, 3)
            ],
            [DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM]
        ));
        this.objectInfos.push(new ObjectInfo(
            'Desk',
            [
                new SpriteInfo('chair', -10, -8, 5),
                new SpriteInfo('desk', 0, 0, 4)
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