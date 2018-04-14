export class HumanProperties {
    private salary: number;
    private speed: number;
    private quality: number;
    private spriteKey: string;
    private name: string;

    constructor(spriteKey: string, name: string, salary: number, speed: number, quality: number) {
        this.spriteKey = spriteKey;
        this.name = name;
        this.salary = salary;
        this.speed = speed;
        this.quality = quality;
    }

    getSpriteKey(): string {
        return this.spriteKey;
    }

    getName(): string {
        return this.name;
    }
}