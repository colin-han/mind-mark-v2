import _ from 'lodash';
import {
    Setting,
    SettingDefinitions,
    SettingParameter,
} from '../model/settings';
import { parseError } from '../util/errors';
import { ParameterDefinition } from '../util/parameter-definition';

const SETTING_PATTERN = /^(\w+)\s*(:?\(([^)]*)\))?$/;
const SETTING_PARAMETERS_PATTERN = /\s*(?:"((?:[^"]|"")*)"|(\w+))\s*/g;

export function parseSetting(line: string): Setting {
    const match = SETTING_PATTERN.exec(line);
    if (!match) throw parseError(`Invalid setting: ${line}`);

    const name = match[1];
    const settingDefinition = SettingDefinitions[name];
    if (!settingDefinition) {
        throw parseError(`Unknown setting: ${name}`);
    }

    const parametersLine = match[2];
    const parameterStrings: string[] = [];
    if (parametersLine) {
        let parameterMatch;
        while (
            (parameterMatch = SETTING_PARAMETERS_PATTERN.exec(parametersLine))
        ) {
            const parameter = parameterMatch[1] || parameterMatch[2];
            if (parameter) {
                parameterStrings.push(parameter);
            }
        }
    }

    const anonymouseParameterName = _.findKey(settingDefinition.parameters, {
        isAnonymous: true,
    });

    const parameters = _.mapValues(
        settingDefinition.parameters,
        (definition) => ({
            definition,
            value: getParameterDefaultValue(definition),
            isSet: false,
        })
    );

    parameterStrings.forEach((value) => {
        let found = false;
        const upperValue = value.toUpperCase();
        for (const key in settingDefinition.parameters) {
            const parameterDefinition = settingDefinition.parameters[key];
            if (parameterDefinition.isAnonymous) continue;

            if (parameterDefinition.enumValues.includes(upperValue)) {
                setParameter(parameters, key, value);
                found = true;
                break;
            }
        }

        if (!found && anonymouseParameterName) {
            setParameter(parameters, anonymouseParameterName, value);
        }
    });

    return {
        definition: settingDefinition,
        parameters: parameters,
    };
}

function getParameterDefaultValue(
    parameter: ParameterDefinition
): string | string[] | undefined {
    if (parameter.allowMultiple) {
        if (!_.isNil(parameter.defaultValue)) {
            return [parameter.defaultValue];
        } else {
            return [];
        }
    }

    return parameter.defaultValue;
}

function setParameter(
    parameters: {
        [x: string]: SettingParameter;
    },
    key: string,
    value: string
) {
    const resultParameter = parameters[key];
    if (resultParameter.definition.allowMultiple) {
        (resultParameter.value as string[]).push(value);
        resultParameter.isSet = true;
    } else {
        if (resultParameter.isSet) {
            throw parseError(`Duplicate parameter: ${key}`);
        }
        resultParameter.value = value;
        resultParameter.isSet = true;
    }
}
