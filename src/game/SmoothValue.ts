const TIME_GAP = Phaser.Timer.SECOND / 10;

export class SmoothValue {
    private value: number;
    private maxValue: number = null;
    private minValue: number = null;

    constructor(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    add(value: number, milliseconds: number = Phaser.Timer.SECOND) {
        if (isNaN(value)) {
            debugger;
        }
        if (milliseconds < TIME_GAP) {
            this.value += value;
        } else {
            setTimeout(() => {
                const numberOfSteps = milliseconds / TIME_GAP;
                const valuePerStep = value / numberOfSteps;

                this.value += valuePerStep;


                this.add(value - valuePerStep, milliseconds - TIME_GAP);
            }, TIME_GAP);
        }
        if (this.maxValue !== null) {
            this.value = Math.min(this.value, this.maxValue);
        }
        if (this.minValue !== null) {
            this.value = Math.max(this.value, this.minValue);
        }
    }

    setMaxValue(number: number) {
        this.maxValue = number;
    }

    setMinValue(number: number) {
        this.minValue = number;
    }

    setValue(number: number) {
        this.add(number - this.value);
    }

    setInstantValue(number: number) {
        this.value = number;
    }
}
