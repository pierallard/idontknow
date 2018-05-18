import {PositionTransformer} from "./PositionTransformer";
import {DEBUG_WORLD, WorldKnowledge} from "./WorldKnowledge";
import {GROUP_AMBIANCE, GROUP_FLOOR} from "./game_state/Play";

const ALPHA = 0.8;

export class Cell {
    private worldKnowledge: WorldKnowledge;
    private position: PIXI.Point;
    private sprite: Phaser.Sprite;
    private ambianceRed: Phaser.Sprite;
    private ambianceYellow: Phaser.Sprite;
    private ambianceGreen: Phaser.Sprite;

    constructor(worldKnowledge: WorldKnowledge, point: PIXI.Point) {
        this.worldKnowledge = worldKnowledge;
        this.position = point;
    }

    create(game: Phaser.Game, groups: {[index: string] : Phaser.Group}) {
        if (DEBUG_WORLD) {
            this.sprite = game.add.sprite(
                PositionTransformer.getRealPosition(this.position).x,
                PositionTransformer.getRealPosition(this.position).y,
                'casedefault'
            );

            this.sprite.anchor.setTo(0.5, 1);
            this.sprite.alpha = 0.5;

            groups[GROUP_FLOOR].add(this.sprite);
        }

        this.ambianceRed = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            'ambiance',
            0
        );
        this.ambianceYellow = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            'ambiance',
            1
        );
        this.ambianceGreen = game.add.sprite(
            PositionTransformer.getRealPosition(this.position).x,
            PositionTransformer.getRealPosition(this.position).y,
            'ambiance',
            2
        );

        this.ambianceRed.anchor.setTo(0.5, 1);
        this.ambianceYellow.anchor.setTo(0.5, 1);
        this.ambianceGreen.anchor.setTo(0.5, 1);

        groups[GROUP_AMBIANCE].add(this.ambianceRed);
        groups[GROUP_AMBIANCE].add(this.ambianceYellow);
        groups[GROUP_AMBIANCE].add(this.ambianceGreen);
    }

    update() {
        if (this.worldKnowledge.getAmbianceDisplayed()) {
            const ambiance = this.worldKnowledge.getAmbiance(this.position);
            if (ambiance <= 1) {
                this.ambianceRed.alpha = (-1 * ambiance + 1) * ALPHA;
                this.ambianceYellow.alpha = ambiance * ALPHA;
                this.ambianceGreen.alpha = 0;
            } else {
                this.ambianceRed.alpha = 0;
                this.ambianceYellow.alpha = (-1 * ambiance + 2) * ALPHA;
                this.ambianceGreen.alpha = (ambiance - 1) * ALPHA;
            }
        } else {
            this.ambianceRed.alpha = 0;
            this.ambianceYellow.alpha = 0;
            this.ambianceGreen.alpha = 0;
        }
    }

    getPosition(): PIXI.Point {
        return this.position;
    }
}
