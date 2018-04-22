const TIME_GAP = Phaser.Timer.SECOND / 10;

export class SmoothValue {
    private value: number;
    private maxValue: number;

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

            if (this.maxValue) {
                this.value = Math.min(this.value + valuePerStep, this.maxValue);
            } else {
                this.value += valuePerStep;
            }

            this.add(value - valuePerStep, milliseconds - TIME_GAP);
        }, TIME_GAP);
    }

    setMaxValue(number: number) {
        this.maxValue = number;
    }

    setValue(number: number) {
        this.value = number;
    }
}