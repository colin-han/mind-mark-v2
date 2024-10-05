import type { NamedEnumType } from './named-enum';
import { Mutable } from 'utility-types';
import _ from 'lodash';

export interface ParameterDefinition {
    readonly type: string;
    readonly isAnonymous: boolean;
    readonly isEnum: boolean;
    readonly enumValues: string[];
    readonly defaultValue?: string;
    readonly allowMultiple?: boolean;
}

const defaultParameter: ParameterDefinition = {
    type: 'string',
    isAnonymous: false,
    isEnum: false,
    enumValues: [],
};

export class ParameterDefinitionBuilder {
    protected readonly parameter: Mutable<ParameterDefinition>;

    constructor(param: Partial<ParameterDefinition> = {}) {
        this.parameter = _.assign({}, defaultParameter, param);
    }

    defaultValue(value: string): this {
        this.parameter.defaultValue = value;
        return this;
    }

    allowMultiple(): this {
        this.parameter.allowMultiple = true;
        return this;
    }

    build(): ParameterDefinition {
        return this.parameter;
    }
}

export function NumberParameter() {
    return new ParameterDefinitionBuilder({ type: 'number' });
}

export function AnonymousParameter() {
    return new ParameterDefinitionBuilder({
        type: 'string',
        isAnonymous: true,
    });
}

export function EnumParameter(enums: NamedEnumType<unknown, string>) {
    return new ParameterDefinitionBuilder({
        type: 'enum',
        isEnum: true,
        enumValues: _.map(enums.alias(), _.toUpper),
    });
}
