import { Setting } from './settings';
import { Statement } from './statement';

export interface Directive extends Statement {
    readonly type: 'directive';
    readonly directiveType: string;
    readonly directiveAlias?: string[];
}

export class SettingDirecitve implements Directive {
    readonly type = 'directive' as const;
    readonly directiveType = 'setting';
    readonly directiveAlias = ['enable'];

    constructor(
        readonly indent: number,
        readonly settings: Setting[]
    ) {}
}

export class IncludeDirective implements Directive {
    readonly type = 'directive' as const;
    readonly directiveType = 'include';

    constructor(
        readonly indent: number,
        readonly ancestorNode: string,
        readonly filter: string
    ) {}
}

export class StyleDirective implements Directive {
    readonly type = 'directive' as const;
    readonly directiveType = 'style';

    constructor(
        readonly indent: number,
        readonly selector: string,
        readonly styles: Record<string, string> = {}
    ) {}
}
