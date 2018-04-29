import {Gauge} from "./Gauge";
import {COLOR} from "../Pico8Colors";
import {MoodSprite} from "../human_stuff/MoodSprite";

export class ColoredGauge extends Gauge {
    constructor(width: number, height: number = null) {
        super(width, COLOR.WHITE, height);
    }

    protected getColor(): COLOR {
        return MoodSprite.getColor(this.value);
    }
}