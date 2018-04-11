export class Depot {
    private objects: { [index:string] : number };

    constructor() {
        this.objects = {}
    }

    add(name: string): void {
        if (this.objects[name] === undefined) {
            this.objects[name] = 0;
        }
        this.objects[name]++;
    }

    getCount(name: string): number {
        if (this.objects[name] === undefined) {
            return 0;
        }
        return this.objects[name];
    }

    remove(name: string): void {
        if (this.objects[name] === undefined) {
            this.objects[name] = 0;
        }
        this.objects[name]--;
    }
}
