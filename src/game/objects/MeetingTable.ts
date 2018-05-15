import {InteractiveObjectInterface} from "./InteractiveObjectInterface";
import {GROUP_INFOS} from "../game_state/Play";
import {AbstractObject} from "./AbstractObject";
import {ObjectDeleter} from "./ObjectDeleter";
import {DeletableObjectInterface} from "./DeletableObjectInterface";

export class MeetingTable extends AbstractObject implements InteractiveObjectInterface, DeletableObjectInterface {
}
