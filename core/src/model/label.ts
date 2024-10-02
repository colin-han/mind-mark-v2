import { Element } from './element';

export class Label {
    constructor(
        readonly content: string,
        readonly sourceType: string,
        readonly source: Element
    ) {}
}
