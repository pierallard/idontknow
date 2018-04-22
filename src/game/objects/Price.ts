
export class Price {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    getStringValue(): string
    {
        return this.value.toString() + " FLOOZ";
    }

    isGreaterThan(value:Price): boolean {
        return this.value >= value.value;
    }

    substract(value: Price): void {
        this.value -= value.value;
    }

    add(value: Price) {
        this.value += value.value;
    }
}