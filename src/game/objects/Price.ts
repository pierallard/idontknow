
export class Price {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    getStringValue(): string
    {
        return this.value.toString() + " FLOOZ";
    }
}