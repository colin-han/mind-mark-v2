import { Element } from './element';

export interface Statement extends Element {
    readonly indent: number;
}
