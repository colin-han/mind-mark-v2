import { Statement } from './statement';

export class Comment implements Statement {
    readonly type = 'comment';

    constructor(
        readonly indent: number,
        readonly text: string
    ) {}
}
