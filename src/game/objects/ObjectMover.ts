import {PositionTransformer} from "../PositionTransformer";
import {MovableObjectInterface} from "./MovableObjectInterface";
import {ObjectSelector} from "./ObjectSelector";
import {WorldKnowledge} from "../WorldKnowledge";

export class ObjectMover {
    static makeMovable(movableObject: MovableObjectInterface, worldKnowledge: WorldKnowledge) {
        movableObject.getSprites().forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.select, this, 0, movableObject, worldKnowledge)
        })
    }

    private static select(sprite, _pointer: Phaser.Pointer, movableObject: MovableObjectInterface, worldKnowledge) {
        const gap = new PIXI.Point(
            _pointer.position.x - PositionTransformer.getRealPosition(movableObject.getPosition()).x,
            _pointer.position.y - PositionTransformer.getRealPosition(movableObject.getPosition()).y
        );
        const moveCallback = (p, x, y) => {
            movableObject.tryToMove(PositionTransformer.getCellPosition(new PIXI.Point(x - gap.x, y - gap.y)));
        };
        movableObject.getSprites().forEach((sprite) => {
            ObjectSelector.setSelected(sprite, true);
        });

        _pointer.game.input.addMoveCallback(moveCallback, this);
        sprite.events.onInputUp.add(this.unselect, this, 0, movableObject, worldKnowledge, movableObject.getPosition());
    }

    private static unselect(
        sprite,
        _pointer: Phaser.Pointer,
        bool,
        movableObject: MovableObjectInterface,
        worldKnowledge: WorldKnowledge,
        startPoint: PIXI.Point
    ) {
        _pointer.game.input.moveCallbacks = [];
        movableObject.getSprites().forEach((sprite) => {
            ObjectSelector.setSelected(sprite, false);
        });
        if (startPoint.x !== movableObject.getPosition().x || startPoint.y !== movableObject.getPosition().y) {
            worldKnowledge.resetAStar(startPoint, movableObject.getPosition());
        }
    }
}
