import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";

export class HumanProperties {
    private salary: number;
    private speed: number;
    private quality: number;
    private type: EMPLOYEE_TYPE;
    private name: string;
    private perseverance: number;
    private spriteVariation: string;
    private wage: number;

    constructor(
        spriteVariation: string,
        type: EMPLOYEE_TYPE,
        name: string,
        salary: number,
        speed: number,
        quality: number,
        perseverance: number,
        wage: number
    ) {
        this.spriteVariation = spriteVariation;
        this.type = type;
        this.name = name;
        this.salary = salary;
        this.speed = speed;
        this.quality = quality;
        this.perseverance = perseverance;
        this.wage = wage;
    }

    getSpriteKey(): string {
        switch (this.type) {
            case EMPLOYEE_TYPE.DEVELOPER: return this.spriteVariation + '_green';
            case EMPLOYEE_TYPE.MARKETING: return this.spriteVariation + '_pink';
            case EMPLOYEE_TYPE.SALE: return this.spriteVariation + '_red';
        }
    }

    getName(): string {
        return this.name;
    }

    getSpeed(): number {
        return this.speed;
    }

    getStrType(): string {
        switch (this.type) {
            case EMPLOYEE_TYPE.DEVELOPER: return 'Developer';
            case EMPLOYEE_TYPE.MARKETING: return 'Marketing';
            case EMPLOYEE_TYPE.SALE: return 'Sale';
        }
    }

    getPerseverance(): number {
        return this.perseverance;
    }

    getType(): EMPLOYEE_TYPE {
        return this.type;
    }

    getWage(): number {
        return this.wage;
    }
}
