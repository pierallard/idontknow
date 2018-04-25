const TIME_GAP = Phaser.Timer.SECOND / 10;

export class SmoothValue {
    private value: number;
    private maxValue: number;
    private minValue: number;

    constructor(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    add(value: number, milliseconds: number = Phaser.Timer.SECOND) {
        if (milliseconds < TIME_GAP) {
            this.value += value;
            return;
        }
        setTimeout(() => {
            const numberOfSteps = milliseconds / TIME_GAP;
            const valuePerStep = value / numberOfSteps;

            this.value += valuePerStep;

            if (this.maxValue) {
                this.value = Math.min(this.value, this.maxValue);
            }

            if (this.minValue) {
                this.value = Math.max(this.value, this.minValue);
            }

            this.add(value - valuePerStep, milliseconds - TIME_GAP);
        }, TIME_GAP);
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
