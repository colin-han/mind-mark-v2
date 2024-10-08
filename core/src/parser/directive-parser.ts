import {
    Directive,
    IncludeDirective,
    SettingDirecitve,
    StyleDirective,
} from '../model/directive';
import { parseError } from '../util/errors';
import { parseSetting } from './setting-parser';

type DirectiveParser = (indent: number, line: string) => Directive;

const DIRECTIVE_PATTERN = /^(\s*)@(\w+)\s+(.*?)\s*$/;
const INCLUDE_DIRECTIVE_PATTERN = /^\s*([^()]+)\s*\(\s*([^()]+)\s*\)\s*$/;
const STYLE_DIRECTIVE_PATTERN = /^\s*#([\w\-.]+)\s+(.*?)\s*$/;
const STYLE_ELEMENT_PATTERN = /^([\w\-.]+)\s*:\s*([^,]+)$/;

type DirectiveMappingConf = {
    [type: string]: [DirectiveParser, ...string[]] | DirectiveParser;
};

type DirectiveMapping = { [type: string]: DirectiveParser };

function buildDirectiveMapping(conf: DirectiveMappingConf): DirectiveMapping {
    const mapping: DirectiveMapping = {};
    for (const [type, parser] of Object.entries(conf)) {
        if (Array.isArray(parser)) {
            const [directiveParser, ...aliases] = parser;
            mapping[type] = directiveParser;
            for (const alias of aliases) {
                mapping[alias] = directiveParser;
            }
        } else {
            mapping[type] = parser;
        }
    }
    return mapping;
}

const directiveMapping: DirectiveMapping = buildDirectiveMapping({
    setting: [parseSettingDirective, 'enable'],
    include: parseIncludeDirective,
    style: parseStyleDirective,
});

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
