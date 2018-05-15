import {ObjectDescription} from "./ObjectDescription";
import {Dispenser} from "./Dispenser";
import {Sofa} from "./Sofa";
import {Desk} from "./Desk";
import {Couch} from "./Couch";
import {InteractivePoint} from "./InteractivePoint";
import {DIRECTION} from "../Direction";
import {SpriteInfo} from "./SpriteInfo";
import {Price} from "./Price";
import {CELL_HEIGHT, CELL_WIDTH} from "../PositionTransformer";

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

        debugger;
        throw "Impossible to find info for " + name;
    }

    private static generateObjectDescriptions() {
        this.objectDescriptions = [];
        this.objectDescriptions.push(
            new ObjectDescription(
                'Dispenser',
                1,
                [new PIXI.Point(0, 0)],
                [
                    new SpriteInfo('dispenser', new PIXI.Point(-4, -4), 3)
                ],
                [
                    new SpriteInfo('dispenser_reverse', new PIXI.Point(-4, -4), 0)
                ],
                [
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(5, -3))
                ],
                [
                    new InteractivePoint([DIRECTION.TOP], new PIXI.Point(5, -CELL_HEIGHT + 3))
                ],
                new Price(70),
                -0.1,
                5
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Sofa',
                1,
                [new PIXI.Point(0, 0)],
                [
                    new SpriteInfo('sofa', new PIXI.Point(0, -8), 3, new PIXI.Point(0, 0))
                ],
                [],
                [
                    new InteractivePoint([DIRECTION.LEFT, DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM], new PIXI.Point(0, -7), new PIXI.Point(0, 0), null, false)
                ],
                [],
                new Price(20),
                0.1,
                5
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Desk',
                1,
                [new PIXI.Point(0, 0)],
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
                new Price(90)
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Meeting Table',
                3,
                [
                    new PIXI.Point(0, 0),
                    new PIXI.Point(1, 1),
                    new PIXI.Point(1, 0),
                    new PIXI.Point(0, 1)
                ],
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
                new Price(150),
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Couch',
                2,
                [
                    new PIXI.Point(0, 0),
                    new PIXI.Point(0, 1),
                ],
                [
                    new SpriteInfo('couch_part1', new PIXI.Point(10, 0), 12),
                    new SpriteInfo('couch_part2', new PIXI.Point(10 - CELL_WIDTH/2, 10), 22, new PIXI.Point(0, 1))
                ],
                [
                    new SpriteInfo('couch_reverse_part1', new PIXI.Point(-13, 0), 12),
                    new SpriteInfo('couch_reverse_part2', new PIXI.Point(-(13 - CELL_WIDTH/2), 9), 22, new PIXI.Point(1, 0)),
                    new SpriteInfo('couch_reverse_cache', new PIXI.Point(-13, 0), 0),
                ],
                [
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(0,  -8), new PIXI.Point(0, 0)),
                    new InteractivePoint([DIRECTION.RIGHT], new PIXI.Point(0, -8), new PIXI.Point(0, 1)),
                ],
                [
                    new InteractivePoint([DIRECTION.TOP], new PIXI.Point(-1, -8), new PIXI.Point(0, 0), false, true),
                    new InteractivePoint([DIRECTION.TOP], new PIXI.Point(-1, -8), new PIXI.Point(1, 0), false, true),
                ],
                new Price(170),
                0.2,
                5
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Console',
                4,
                [
                    new PIXI.Point(0, 0),
                    new PIXI.Point(1, 1),
                    new PIXI.Point(1, 0),
                    new PIXI.Point(0, 1)
                ],
                [
                    new SpriteInfo('couch_part1', new PIXI.Point(10 - CELL_WIDTH/2, 0 - CELL_HEIGHT/2), 12, new PIXI.Point(0, 0)),
                    new SpriteInfo('couch_part2', new PIXI.Point(10 - CELL_WIDTH/2 - CELL_WIDTH/2, 10- CELL_HEIGHT/2), 22, new PIXI.Point(0, 1)),
                    new SpriteInfo('tv', new PIXI.Point(16, -6), 0, new PIXI.Point(0, 0))
                ],
                [
                    new SpriteInfo('tv_reverse', new PIXI.Point(-1, -13), 0, new PIXI.Point(0, 1)),
                    new SpriteInfo('couch_reverse_part1', new PIXI.Point(-13 - CELL_WIDTH/2, CELL_HEIGHT/2), 12, new PIXI.Point(0, 1)),
                    new SpriteInfo('couch_reverse_part2', new PIXI.Point(-(13 - CELL_WIDTH/2) - CELL_WIDTH/2, 9 + CELL_HEIGHT/2), 22, new PIXI.Point(1, 1)),
                    new SpriteInfo('couch_reverse_cache', new PIXI.Point(-13, 0), 0, new PIXI.Point(0, 0)),
                ],
                [
                    new InteractivePoint([DIRECTION.RIGHT, DIRECTION.BOTTOM], new PIXI.Point(0 - CELL_WIDTH/2,  -8 - CELL_HEIGHT/2), new PIXI.Point(0, 0)),
                    new InteractivePoint([DIRECTION.RIGHT, DIRECTION.TOP], new PIXI.Point(0 - CELL_WIDTH/2, -8 - CELL_HEIGHT/2), new PIXI.Point(0, 1)),
                ],
                [
                    new InteractivePoint([DIRECTION.TOP, DIRECTION.RIGHT], new PIXI.Point(-1 - CELL_WIDTH/2, -8 + CELL_HEIGHT/2), new PIXI.Point(0, 1), false, true),
                    new InteractivePoint([DIRECTION.TOP, DIRECTION.LEFT], new PIXI.Point(-1 - CELL_WIDTH/2, -8 + CELL_HEIGHT/2), new PIXI.Point(1, 1), false, true),
                ],
                new Price(1950),
                -0.3,
                5
            )
        );
        this.objectDescriptions.push(
            new ObjectDescription(
                'Lamp',
                1,
                [new PIXI.Point(0, 0)],
                [new SpriteInfo('lamp')],
                [new SpriteInfo('lamp_reverse')],
                [],
                [],
                new Price(100),
                0.1,
                5
            )
        )
    }

    static getSalableObjects(level: number): ObjectDescription[] {
        if (this.objectDescriptions === null) {
            this.generateObjectDescriptions();
        }

        return this.objectDescriptions.filter((objectDescription) => {
            return objectDescription.getMinLevel() <= level;
        });
    }
}
