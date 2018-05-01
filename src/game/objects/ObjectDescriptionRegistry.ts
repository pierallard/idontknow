import {ObjectDescription} from "./ObjectDescription";
import {Dispenser} from "./Dispenser";
import {Sofa} from "./Sofa";
import {Desk} from "./Desk";
import {Table} from "./Table";
import {Couch} from "./Couch";
import {InteractivePoint} from "./InteractivePoint";
import {DIRECTION} from "../Direction";
import {SpriteInfo} from "./SpriteInfo";
import {Price} from "./Price";

export class ObjectDescriptionRegistry {
    private static objectDescriptions: ObjectDescription[] = null;

    static getObjectDescription(name: string): ObjectDescription {
        if (this.objectDescriptions === null) {
            this.generateObjectDescriptions();
        }

        for (let i = 0; i < this.objectDescriptions.length; i++) {
            if (this.objectDescriptions[i].getName() === name) {
                return this.objectDescriptions[i];
            }
        }

        throw "Impossible to find info for " + name;
    }

    private static generateObjectDescriptions() {
        this.objectDescriptions = [];
        this.objectDescriptions.push(
            new ObjectDescription(
                'Dispenser',
                [
                    new SpriteInfo('dispenser', new PIXI.Point(-4, -4), 3,  new PIXI.Point(0, 0))
                ],
                [],
                [
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(0, 0), new PIXI.Point(0, 0))
                ],
                [],
                new Price(70)
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Sofa',
                [
                    new SpriteInfo('sofa', new PIXI.Point(0, -8), 3, new PIXI.Point(0, 0))
                ],
                [],
                [
                    new InteractivePoint([DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM], new PIXI.Point(0, -7), new PIXI.Point(0, 0), null, false)
                ],
                [],
                new Price(10)
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Desk',
                [
                    new SpriteInfo('chair', new PIXI.Point(-10, -8), 5),
                    new SpriteInfo('desk', new PIXI.Point(0, 0), 4)
                ],
                [
                    new SpriteInfo('desk_reverse', new PIXI.Point(0, 0), 10, new PIXI.Point(0, 0)),
                    new SpriteInfo('chair_reverse', new PIXI.Point(-6, -4), 5, new PIXI.Point(0, 0)),
                ],
                [
                    new InteractivePoint([DIRECTION.BOTTOM, DIRECTION.TOP, DIRECTION.LEFT], new PIXI.Point(-10, -11)),
                ],
                [
                    new InteractivePoint([DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.RIGHT], new PIXI.Point(-3, -8), new PIXI.Point(0, 0), false, true),
                ],
                new Price(20)
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Table',
                [
                    new SpriteInfo('chair2', new PIXI.Point( -8, -9), 5, new PIXI.Point(1, 1)),
                    new SpriteInfo('table', new PIXI.Point(0, 0), 4, new PIXI.Point( 1, 1)),
                    new SpriteInfo('chair2', new PIXI.Point(-8, -9), 5, new PIXI.Point(1, 0)),
                    new SpriteInfo('table', new PIXI.Point(0, 0), 4, new PIXI.Point(1, 0)),
                    new SpriteInfo('table_reverse', new PIXI.Point(0, 0), 10, new PIXI.Point(0, 1)),
                    new SpriteInfo('chair2_reverse', new PIXI.Point( 6, -5), 5, new PIXI.Point(0, 1)),
                    new SpriteInfo('table_reverse', new PIXI.Point(0, 0), 10, new PIXI.Point(0, 0)),
                    new SpriteInfo('chair2_reverse', new PIXI.Point(6, -5), 5, new PIXI.Point(0, 0)),
                ],
                [],
                [
                    new InteractivePoint([DIRECTION.TOP, DIRECTION.LEFT], new PIXI.Point(-8, -11), new PIXI.Point(1, 1)),
                    new InteractivePoint([DIRECTION.BOTTOM, DIRECTION.LEFT], new PIXI.Point(-8, -11), new PIXI.Point(1, 0)),
                    new InteractivePoint([DIRECTION.TOP, DIRECTION.RIGHT], new PIXI.Point(4, -7), new PIXI.Point(0, 1), true, true),
                    new InteractivePoint([DIRECTION.BOTTOM, DIRECTION.RIGHT], new PIXI.Point(4, -7), new PIXI.Point(0, 0), true, true),
                ],
                [],
                new Price(12)
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Couch',
                [
                    new SpriteInfo('couch_part1', new PIXI.Point(10, 0), 12),
                    new SpriteInfo('couch_part2', new PIXI.Point(10 - 20, 10), 22, new PIXI.Point(0, 1))
                ],
                [],
                [
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(0,  -8), new PIXI.Point(0, 0)),
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(0, -8), new PIXI.Point(0, 1)),
                ],
                [],
                new Price(1)
            )
        );
    }

    static getSalableObjects(): ObjectDescription[] {
        if (this.objectDescriptions === null) {
            this.generateObjectDescriptions();
        }

        return this.objectDescriptions;
    }
}
