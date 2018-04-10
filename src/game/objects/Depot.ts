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
}
