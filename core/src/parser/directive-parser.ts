import {
    Directive,
    IncludeDirective,
    Setting,
    SettingDirecitve,
    StyleDirective,
} from '../model/directive';
import { parseError } from '../util/errors';

type DirectiveParser = (indent: number, line: string) => Directive;

const DIRECTIVE_PATTERN = /^(\s*)@(\w+)\s+(.*?)\s*$/;
const INCLUDE_DIRECTIVE_PATTERN = /^\s*([^()]+)\s*\(\s*([^()]+)\s*\)\s*$/;
const STYLE_DIRECTIVE_PATTERN = /^\s*#([\w\-.]+)\s+(.*?)\s*$/;
const STYLE_ELEMENT_PATTERN = /^([\w\-.]+)\s*:\s*([^,]+)$/;
const SETTING_PATTERN = /^(\w+)\s*(:?\(([^)]*)\))?$/;
const SETTING_PARAMETERS_PATTERN = /\s*(?:"((?:[^"]|"")*)"|(\w+))\s*/g;

const directiveMapping: {
    [type: string]: DirectiveParser;
} = {
    setting: parseSettingDirective,
    include: parseIncludeDirective,
    style: parseStyleDirective,
};

function parseSetting(line: string): Setting {
    const match = SETTING_PATTERN.exec(line);
    if (!match) throw parseError(`Invalid setting: ${line}`);

    const name = match[1];
    const parametersLine = match[2];
    const parameters: string[] = [];
    if (parametersLine) {
        let parameterMatch;
        while (
            (parameterMatch = SETTING_PARAMETERS_PATTERN.exec(parametersLine))
        ) {
            const parameter = parameterMatch[1] || parameterMatch[2];
            if (parameter) {
                parameters.push(parameter);
            }
        }
    }

    return new Setting(name, parameters);
}

function parseSettingDirective(indent: number, line: string): SettingDirecitve {
    const lines = line.split(/\s*,\s*/);
    return new SettingDirecitve(
        indent,
        lines.map((l) => parseSetting(l))
    );
}

function parseIncludeDirective(indent: number, line: string): IncludeDirective {
    const matcher = INCLUDE_DIRECTIVE_PATTERN.exec(line);
    if (!matcher) {
        throw parseError(`Invalid include directive: ${line}`);
    }

    return new IncludeDirective(indent, matcher[1], matcher[2]);
}

function parseStyleDirective(indent: number, line: string): StyleDirective {
    const matcher = STYLE_DIRECTIVE_PATTERN.exec(line);
    if (!matcher) {
        throw parseError(`Invalid style directive: ${line}`);
    }

    const directive = new StyleDirective(indent, matcher[1]);
    const styles = matcher[2].split(/\s*,\s*/);
    for (const style of styles) {
        const keyValue = STYLE_ELEMENT_PATTERN.exec(style);
        if (!keyValue) {
            throw parseError(`Invalid style syntax: ${style}`);
        }
        directive.styles[keyValue[1].toLowerCase()] = keyValue[2];
    }
    return directive;
}

export function parseDirective(line: string) {
    const matcher = DIRECTIVE_PATTERN.exec(line);
    if (!matcher) {
        throw parseError('Invalid directive: ' + line);
    }

    // TODO: validate the indent characters, if is \t, throw parse exception.
    const indent = matcher[1].length;
    const type: string = matcher[2];
    const value: string = matcher[3];

    if (type in directiveMapping) {
        return directiveMapping[type](indent, value);
    }

    throw parseError(`Unknown directive type: ${type}`);
}
