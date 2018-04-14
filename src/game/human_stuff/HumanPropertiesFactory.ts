import {HumanProperties} from "./HumanProperties";

const NAMES = [
    'Michel',
    'Jean-Paul',
    'Jean-Louis',
    'Patrick',
    'Albert'
];

export class HumanPropertiesFactory {
    static create() {
        return new HumanProperties(
            Math.random() > 0.5 ? 'human' : 'human_red',
            NAMES[Math.floor(Math.random() * NAMES.length)],
            Math.random(),
            Math.random(),
            Math.random()
        );
    }
}