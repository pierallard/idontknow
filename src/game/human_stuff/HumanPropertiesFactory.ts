import {HumanProperties} from "./HumanProperties";
import {HUMAN_SPRITE_VARIATIONS} from "./Employee";

const NAMES = [
    'Michel',
    'Jean-Paul',
    'Jean-Louis',
    'Patrick',
    'Albert'
];

export enum EMPLOYEE_TYPE {
    DEVELOPER = 0,
    MARKETING,
    SALE,
}

const USE_API = false;

export class HumanPropertiesFactory {
    static create(type: EMPLOYEE_TYPE = null) {
        return new HumanProperties(
            HUMAN_SPRITE_VARIATIONS[Math.floor(Math.random() * HUMAN_SPRITE_VARIATIONS.length)],
            type !== null ? type : [
                EMPLOYEE_TYPE.DEVELOPER,
                EMPLOYEE_TYPE.MARKETING,
                EMPLOYEE_TYPE.SALE
            ][Math.floor(Math.random() * 3)],
            USE_API ? this.generateName() : NAMES[Math.floor(Math.random() * NAMES.length)],
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random()
        );
    }

    private static generateName(): string {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://randomuser.me/api/?nat=fr,en,de&inc=gender,name,nat', false);
        xhr.send();
        const result = JSON.parse(xhr.response).results[0];
        return (result.name.first + ' ' + result.name.last).substr(0, 15);
    }
}
