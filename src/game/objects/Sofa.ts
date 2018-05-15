import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {GROUP_INFOS} from "../game_state/Play";
import {DeletableObjectInterface} from "./DeletableObjectInterface";

export class Sofa extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
    forceLeftOrientation(interactivePointIdentifier: number): boolean {
        return null;
    }
}
