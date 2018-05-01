import {HumanProperties} from "./HumanProperties";
import {HUMAN_SPRITE_VARIATIONS} from "./Employee";

const MEN = [
    'Michel',
    'Jean-Paul',
    'Jean-Louis',
    'Patrick',
    'Albert'
];

const WOMEN = [
    'Micheline',
    'Paulette',
    'Louisette',
    'Patricia',
];

export enum EMPLOYEE_TYPE {
    DEVELOPER = 0,
    MARKETING,
    SALE,
}

const USE_API = false;

export class HumanPropertiesFactory {
    static create(types: EMPLOYEE_TYPE[] = [
        EMPLOYEE_TYPE.DEVELOPER,
        EMPLOYEE_TYPE.MARKETING,
        EMPLOYEE_TYPE.SALE
    ]) {
        const variation = HUMAN_SPRITE_VARIATIONS[Math.floor(Math.random() * HUMAN_SPRITE_VARIATIONS.length)];
        const isWoman = ['human3'].indexOf(variation) > -1;
        const names = isWoman ? WOMEN : MEN;
        return new HumanProperties(
            variation,
            types[Math.floor(Math.random() * types.length)],
            USE_API ? this.generateName(isWoman) : names[Math.floor(Math.random() * names.length)],
            Math.random(),
            Math.random(),
            Math.random()
        );
    }

    private static generateName(isWoman: boolean): string {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://randomuser.me/api/?gender=' + (isWoman ? 'female' : 'male') + '&nat=fr,en,de&inc=gender,name,nat', false);
        xhr.send();
        const result = JSON.parse(xhr.response).results[0];
        return (result.name.first + ' ' + result.name.last).substr(0, 15);
    }
}
