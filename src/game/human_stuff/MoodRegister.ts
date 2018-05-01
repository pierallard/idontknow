import {HumanRepository} from "../repositories/HumanRepository";
import {INTERFACE_WIDTH} from "../user_interface/UserInterface";

export class MoodRegister {
    private humanRepository: HumanRepository
    private moods: number[];

    constructor(humanRepository: HumanRepository) {
        this.humanRepository = humanRepository;
        this.moods = [];
    }

    create(game: Phaser.Game) {
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.updateMood, this);
    }

    updateMood() {
        const moods = this.humanRepository.humans.map((human) => {
            return human.getMood();
        });
        const avgMood = moods.reduce((prev, mood) => { return prev + mood; }, 0) / moods.length;
        this.moods.push(avgMood);
    }

    getLastMoods(): number[] {
        let result = [];
        for (let i = 0; i < INTERFACE_WIDTH; i++) {
            result.push(this.moods[this.moods.length - 1 - i]);
        }
        return result;
    }
}