import {PositionTransformer} from "../PositionTransformer";
import {MovableObjectInterface} from "./MovableObjectInterface";
import {ObjectSelector} from "./ObjectSelector";
import {World} from "../World";

export class ObjectMover {
    static makeMovable(movableObject: MovableObjectInterface, world: World) {
        movableObject.getSprites().forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.select, this, 0, movableObject, world)
        })
    }

    private static select(sprite, _pointer: Phaser.Pointer, movableObject: MovableObjectInterface, world) {
        const gap = new PIXI.Point(
            _pointer.position.x - PositionTransformer.getRealPosition(movableObject.getPosition()).x,
            _pointer.position.y - PositionTransformer.getRealPosition(movableObject.getPosition()).y
        );
        const moveCallback = (p, x, y) => {
            movableObject.tryToMove(new PIXI.Point(x - gap.x, y - gap.y));
        };
        movableObject.getSprites().forEach((sprite) => {
            ObjectSelector.setSelected(sprite, true);
        });

        _pointer.game.input.addMoveCallback(moveCallback, this);
        sprite.events.onInputUp.add(this.unselect, this, 0, movableObject, world);
    }

    private static unselect(sprite, _pointer: Phaser.Pointer, bool, movableObject: MovableObjectInterface, world: World) {
        _pointer.game.input.moveCallbacks = [];
        movableObject.getSprites().forEach((sprite) => {
            ObjectSelector.setSelected(sprite, false);
        });
        world.resetAStar();
    }
}
