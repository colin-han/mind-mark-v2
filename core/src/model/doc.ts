import { Node } from './node';

export class Doc {
    name: string;
    root: Node;

    constructor(name: string) {
        this.name = name;
        this.root = new Node(-1, name, [], []);
    }
}
