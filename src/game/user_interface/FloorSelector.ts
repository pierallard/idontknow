import {GRID_FLOOR, WorldKnowledge} from "../WorldKnowledge";
import {GROUP_FLOOR, GROUP_INTERFACE, GROUP_OBJECTS_AND_HUMANS} from "../game_state/Play";
import {TEXT_STYLE} from "../TextStyle";

export class FloorSelector {
    private worldKnowledge: WorldKnowledge;
    private sprite: Phaser.Sprite;
    private currentFloor: number;
    private currentFloorText: Phaser.Text;
    private groups: { [index: string]: Phaser.Group };

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
        this.currentFloor = 0;
    }

    create(game: Phaser.Game, groups: { [index: string]: Phaser.Group }) {
        this.groups = groups;

        this.sprite = game.add.sprite(0, 0, 'floorselector', 0, groups[GROUP_INTERFACE]);
        this.sprite.inputEnabled = true;
        this.sprite.input.pixelPerfectOver = true;
        this.sprite.input.pixelPerfectClick = true;
        this.sprite.input.useHandCursor = true;
        this.sprite.events.onInputDown.add(this.click, this, 0);

        this.currentFloorText = game.add.text(4, 12, this.currentFloor + '', TEXT_STYLE, groups[GROUP_INTERFACE]);

        this.update();
    }

    private click(_sprite, f) {
        if (f.position.y <= 9) {
            this.up();
        } else if (f.position.y >= (28 - 9)) {
            this.down();
        }
    }

    public up() {
        if (this.currentFloor >= (GRID_FLOOR - 1)) {
            return;
        }
        this.currentFloor += 1;
        this.update();
    }

    public down() {
        if (this.currentFloor <= 0) {
            return;
        }
        this.currentFloor -= 1;
        this.update();
    }

    private update() {
        this.currentFloorText.setText(this.currentFloor + '');
        for (let i = 0; i < GRID_FLOOR; i++) {
            const groupFloor = this.groups[GROUP_FLOOR + i];
            const groupObjAndHumans = this.groups[GROUP_OBJECTS_AND_HUMANS + i];
            const visible = i <= this.currentFloor;
            groupFloor.alpha = visible ? 1 : 0;
            groupObjAndHumans.alpha = visible ? 1 : 0;
            groupFloor.position.set(visible ? 0 : -10000, 0);
            groupObjAndHumans.position.set(visible ? 0 : -10000, 0);
        }
    }
}