import {
    ParameterDefinition,
    ParameterDefinitionBuilder,
} from '../util/parameter-definition';

export interface SettingDefinition {
    name: string;
    inheritalbe?: boolean;
    parameters: Record<string, ParameterDefinition>;
}

export interface SettingDefinitionBuilder {
    name: string;
    inheritalbe?: boolean;
    parameters: Record<string, ParameterDefinitionBuilder>;
}

export function buildSetting(
    builder: SettingDefinitionBuilder
): SettingDefinition {
    const parameters: Record<string, ParameterDefinition> = {};
    for (const key in builder.parameters) {
        parameters[key] = builder.parameters[key].build();
    }
    return {
        name: builder.name,
        inheritalbe: builder.inheritalbe,
        parameters,
    };
}
