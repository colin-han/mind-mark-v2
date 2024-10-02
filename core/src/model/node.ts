import { Directive } from './directive';
import { Estimation } from './estimation';
import { Label } from './label';
import { Statement } from './statement';

export class Node implements Statement {
    readonly type = 'node';

    parent?: Node;
    readonly children: Node[] = [];
    readonly directives: Directive[] = [];

    estimation?: Estimation;

    readonly labels: Label[] = [];
    readonly titlePrefix: string[] = [];
    readonly titlePostfix: string[] = [];

    constructor(
        readonly indent: number,
        readonly name: string,
        readonly assignees: string[],
        readonly tags: string[],
        estimation?: Estimation
    ) {
        this.estimation = estimation;
    }
}
