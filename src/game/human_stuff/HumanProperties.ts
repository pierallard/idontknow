import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";

export class HumanProperties {
    private salary: number;
    private speed: number;
    private quality: number;
    private type: EMPLOYEE_TYPE;
    private name: string;
    private perseverance: number;

    constructor(type: EMPLOYEE_TYPE, name: string, salary: number, speed: number, quality: number, perseverance: number) {
        this.type = type;
        this.name = name;
        this.salary = salary;
        this.speed = speed;
        this.quality = quality;
        this.perseverance = perseverance;
    }

    getSpriteKey(): string {
        switch (this.type) {
            case EMPLOYEE_TYPE.DEVELOPER: return 'human';
            case EMPLOYEE_TYPE.MARKETING: return 'human_pink';
            case EMPLOYEE_TYPE.SALE: return 'human_red';
        }
    }

    getName(): string {
        return this.name;
    }

    getSpeed() {
        return this.speed;
    }

    getStrType() {
        switch (this.type) {
            case EMPLOYEE_TYPE.DEVELOPER: return 'Developer';
            case EMPLOYEE_TYPE.MARKETING: return 'Marketing';
            case EMPLOYEE_TYPE.SALE: return 'Sale';
        }
    }

    getPerseverance() {
        return this.perseverance;
    }
}