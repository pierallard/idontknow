import {EMPLOYEE_TYPE} from "./HumanPropertiesFactory";
import {Price} from "../objects/Price";

const MAX_WAGE = 50;
const MIN_WAGE = 10;
export const DAY_DURATION = 60 * Phaser.Timer.SECOND;

export class HumanProperties {
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
        speed: number,
        quality: number,
        perseverance: number
    ) {
        this.spriteVariation = spriteVariation;
        this.type = type;
        this.name = name;
        this.speed = speed;
        this.quality = quality;
        this.perseverance = perseverance;
        this.wage = this.computeWage();
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

    getQuality(): number {
        return this.quality;
    }

    private computeWage() {
        return (this.speed + this.perseverance + 2 * this.quality) / 4;
    }

    getRealWage(): Price {
        return new Price(- (MIN_WAGE + this.wage * (MAX_WAGE - MIN_WAGE)));
    }
}
