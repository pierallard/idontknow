
export class Price {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    getStringValue(): string {
        if (this.value >= 10000000) {
            return Math.round(this.value / 100000) / 10 + ' m$'
        }
        if (this.value >= 10000) {
            return Math.round(this.value / 100) / 10 + ' k$'
        }
        return Math.ceil(this.value).toString() + " $";
    }

    isGreaterThan(value:Price): boolean {
        return this.value >= value.value;
    }

    add(value: Price) {
        this.value += value.value;
    }

    getValue(): number {
        return this.value;
    }
}