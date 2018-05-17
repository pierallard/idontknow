import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {AbstractObject} from "./AbstractObject";
import {DeletableObjectInterface} from "./DeletableObjectInterface";

export class Sofa extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
    forceLeftOrientation(interactivePointIdentifier: number): boolean {
        return null;
    }
}
