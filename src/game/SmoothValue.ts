export class SmoothValue {
    private value: number;
    private maxValue: number = null;
    private minValue: number = null;
    private pendingDiffs: {value: number, remainingTime: number}[];
    private lastUpdate: number;

    constructor(value: number) {
        this.value = value;
        this.pendingDiffs = [];
        this.lastUpdate = (new Date()).getTime();
    }

    update() {
        let i = 0;
        const diffTime = (new Date()).getTime() - this.lastUpdate;
        let changed = false;
        while (i < this.pendingDiffs.length) {
            const pendingDiff = this.pendingDiffs[i];
            if (pendingDiff.remainingTime <= diffTime) {
                this.value += pendingDiff.value;
                this.pendingDiffs.splice(i, 1);
            } else {
                const diffValue = pendingDiff.value / pendingDiff.remainingTime * diffTime
                this.value += diffValue;
                this.pendingDiffs[i].value -= diffValue;
                this.pendingDiffs[i].remainingTime -= diffTime;
                i++;
            }
            changed = true;
        }
        if (changed) {
            this.checkBounds();
        }
        this.lastUpdate = (new Date()).getTime();
    }

    getValue(): number {
        return this.value;
    }

    add(value: number, milliseconds: number = Phaser.Timer.SECOND) {
        if (milliseconds <= 0) {
            this.value += value;
            this.checkBounds();
        } else {
            this.pendingDiffs.push({
                value: value,
                remainingTime: milliseconds
            });
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

    private checkBounds() {
        if (this.maxValue && this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        if (this.minValue && this.value < this.minValue) {
            this.value = this.minValue;
        }
    }
}
