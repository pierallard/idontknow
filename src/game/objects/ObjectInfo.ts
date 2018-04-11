import {SpriteInfo} from "./SpriteInfo";
import {DIRECTION, Direction} from "../Direction";

export class ObjectInfo {
    private name: string;
    private sprites: SpriteInfo[];
    private entryPoints: DIRECTION[];

    constructor(name: string, spriteInfos: SpriteInfo[], entryPoints: DIRECTION[]) {
        this.name = name;
        this.sprites = spriteInfos;
        this.entryPoints = entryPoints;
    }

    getName() {
        return this.name;
    }

    getSpriteInfos(): SpriteInfo[] {
        return this.sprites;
    }

    getEntryPoints(leftOriented: boolean): DIRECTION[] {
        if (!leftOriented) {
            return this.entryPoints;
        } else {
            return this.entryPoints.map((entryPoint) => {
                return Direction.getHorizontalMirror(entryPoint);
            });
        }
    }
}