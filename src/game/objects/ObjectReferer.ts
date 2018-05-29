import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {DIRECTION} from "../Direction";
import {Employee} from "../human_stuff/Employee";
import {Point} from "../Point";

export class ObjectReferer {
    private obj: InteractiveObjectInterface;
    private interactivePointIdentifier: number;

    constructor(object: InteractiveObjectInterface, interactivePointIdentifier: number) {
        this.obj = object;
        this.interactivePointIdentifier = interactivePointIdentifier;
    }

    getObject(): InteractiveObjectInterface {
        return this.obj;
    }

    isUsed(): boolean {
        return this.obj.isUsed(this.interactivePointIdentifier);
    }

    getPositionGap(): PIXI.Point {
        return this.obj.getPositionGap(this.interactivePointIdentifier);
    }

    getEntries(): DIRECTION[] {
        return this.obj.getEntries(this.interactivePointIdentifier);
    }

    getPosition(): Point {
        return this.obj.getCellPositionSubObject(this.interactivePointIdentifier);
    }

    setUsed(human: Employee) {
        this.obj.setUsed(this.interactivePointIdentifier, human);
    }

    setUnused() {
        this.obj.setUnused(this.interactivePointIdentifier);
    }

    getIdentifier(): number {
        return this.interactivePointIdentifier;
    }

    forceLeftOrientation(): boolean {
        return this.obj.forceLeftOrientation(this.interactivePointIdentifier)
    }

    forceTopOrientation(): boolean {
        return this.obj.forceTopOrientation(this.interactivePointIdentifier)
    }
}
