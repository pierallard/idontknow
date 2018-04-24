import {WorldKnowledge} from "../WorldKnowledge";
import {CAMERA_HEIGHT_PIXELS, CAMERA_WIDTH_PIXELS, WORLD_HEIGHT, WORLD_WIDTH} from "../../app";
import {INTERFACE_WIDTH, UserInterface} from "../user_interface/UserInterface";
import {Camembert} from "../Camembert";

export const GROUP_FLOOR = 'floor';
export const GROUP_OBJECTS_AND_HUMANS = 'objects_and_humans';
export const GROUP_INFOS = 'infos';
export const GROUP_INTERFACE = 'interface';
export const CAMERA_GAP = 2;

export default class Play extends Phaser.State {
    private worldKnowledge: WorldKnowledge;
    private groups: {[index: string] : Phaser.Group};
    private userInterface: UserInterface;
    private upKey: Phaser.Key;
    private downKey: Phaser.Key;
    private leftKey: Phaser.Key;
    private rightKey: Phaser.Key;

    constructor() {
        super();
        this.worldKnowledge = new WorldKnowledge();
        this.userInterface = new UserInterface(this.worldKnowledge);
        this.worldKnowledge.setUserInterface(this.userInterface);
    }

    public create() {
        this.game.stage.backgroundColor = "#494947";
        this.groups = {};
        this.groups[GROUP_FLOOR] = this.game.add.group();
        this.groups[GROUP_OBJECTS_AND_HUMANS] =  this.game.add.group();
        this.groups[GROUP_INFOS] = this.game.add.group();
        this.groups[GROUP_INTERFACE] = this.game.add.group();

        this.groups[GROUP_INTERFACE].fixedToCamera = true;

        this.worldKnowledge.create(this.game, this.groups);
        this.userInterface.create(this.game, this.groups);

        this.game.world.setBounds(0, 0, WORLD_WIDTH + INTERFACE_WIDTH, WORLD_HEIGHT);
        this.game.camera.setPosition((WORLD_WIDTH - CAMERA_WIDTH_PIXELS) / 2, (WORLD_HEIGHT - CAMERA_HEIGHT_PIXELS) / 2);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    update(game: Phaser.Game) {
        this.groups[GROUP_OBJECTS_AND_HUMANS].sort('y', Phaser.Group.SORT_ASCENDING);
        this.worldKnowledge.update();
        this.userInterface.update();

        if (this.upKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - CAMERA_GAP);
        }
        else if (this.downKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + CAMERA_GAP);
        }
        if (this.leftKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - CAMERA_GAP, this.game.camera.position.y);
        }
        else if (this.rightKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x + CAMERA_GAP, this.game.camera.position.y);
        }
        /*
        const selected = this.worldKnowledge.getSelectedHumanSprite();
        if (null !== selected) {
            this.game.camera.follow(selected, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }*/
    }
}
