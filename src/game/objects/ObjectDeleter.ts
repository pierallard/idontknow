import {DeletableObjectInterface} from "./DeletableObjectInterface";
import {MovableObjectInterface} from "./MovableObjectInterface";

const POINTS = 20;
const RADIUS = 6;
const DELAY = 1500;

export class ObjectDeleter {
    static makeDeletable(object: DeletableObjectInterface, game: Phaser.Game, group: Phaser.Group) {
        const circle = new PartialCircle(game, this.getPosition(object).x, this.getPosition(object).y, group);
        game.add.existing(circle);
        group.add(circle);

        object.getSprites().forEach((sprite) => {
            sprite.inputEnabled = true;
            sprite.input.pixelPerfectOver = true;
            sprite.input.pixelPerfectClick = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(this.select, this, 0, game, object, circle);
        });
    }

    private static select(
        sprite,
        _pointer: Phaser.Pointer,
        game: Phaser.Game,
        object: MovableObjectInterface,
        circle: PartialCircle
    ) {
        circle.alpha = 1;
        circle.percentage = 1.0;
        const tween = game.add.tween(circle).to({
            percentage: 0
        }, DELAY, 'Linear', true, 0, 0, false);
        const event = game.time.events.add(DELAY, this.removeObject, this, object);
        sprite.events.onInputUp.add(this.cancelRemoval, this, 0, game, tween, event, circle);
    }

    private static cancelRemoval(
        sprite: Phaser.Sprite,
        _pointer: Phaser.Pointer,
        _boolean: boolean,
        game: Phaser.Game,
        tween: Phaser.Tween,
        event: Phaser.TimerEvent,
        circle: PartialCircle
    ) {
        tween.stop(false);
        game.time.events.remove(event);
        game.time.events.clearPendingEvents();
        sprite.events.onInputUp.removeAll();
        circle.alpha = 0;
    }

    private static removeObject(object: DeletableObjectInterface) {
        object.remove();
    }

    private static getPosition(object: DeletableObjectInterface) {
        const xMin = object.getSprites().map((sprite) => {
            return (sprite.position.x - sprite.width / 2);
        }).reduce((a, b) => {
            return Math.min(a, b);
        });

        const xMax = object.getSprites().map((sprite) => {
            return (sprite.position.x + sprite.width / 2);
        }).reduce((a, b) => {
            return Math.max(a, b);
        });

        const yMin = object.getSprites().map((sprite) => {
            return (sprite.position.y);
        }).reduce((a, b) => {
            return Math.min(a, b);
        });

        const yMax = object.getSprites().map((sprite) => {
            return (sprite.position.y - sprite.width);
        }).reduce((a, b) => {
            return Math.max(a, b);
        });

        return new PIXI.Point(xMin + (xMax - xMin) / 2, yMin + (yMax - yMin) / 2);
    }
}

class PartialCircle extends Phaser.Graphics {
    public percentage: number;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group) {
        super(game, x, y);
        this.percentage = 1.0;
        game.add.existing(this);
        group.add(this);
        this.alpha = 0;
    }

    update() {
        if (this.alpha > 0) {
            this.redraw();
        }
    }

    private redraw() {
        this.clear();
        this.lineStyle(3, 0xff004d);
        this.moveTo(0, -RADIUS);
        for (let i = 0; i < POINTS * this.percentage; i++) {
            const angle = Math.PI * 2 / POINTS * (i + 1) + Math.PI;
            this.lineTo(- Math.sin(angle) * RADIUS, Math.cos(angle) * RADIUS);
        }
    }
}
