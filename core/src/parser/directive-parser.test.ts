import { parseDirective } from './directive-parser';
import {
    IncludeDirective,
    SettingDirecitve,
    StyleDirective,
} from '../model/directive';
import { parseError } from '../util/errors';

describe('parseDirective', () => {
    it('should parse a setting directive correctly', () => {
        const line = '  @setting key(value)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.directiveType).toBe('setting');
        expect(directive.indent).toBe(2);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value'] },
        ]);
    });

    it('should parse a setting directive without parameters correctly', () => {
        const line = '  @setting key';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: [] },
        ]);
    });

    it('should parse a setting directive without parameters correctly 2', () => {
        const line = '  @setting key()  ';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: [] },
        ]);
    });

    it('should be able to parse a setting directive with multiple parameters', () => {
        const line = '  @setting key(value another)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value', 'another'] },
        ]);
    });

    it('should be able to parse a setting directive with multiple settings', () => {
        const line = '  @setting key(value), another(1)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value'] },
            { name: 'another', parameters: ['1'] },
        ]);
    });

    it('should be able to parse a setting directive with mulitple setings with multiple parameters', () => {
        const line = '  @setting key(value another), another(1 2)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value', 'another'] },
            { name: 'another', parameters: ['1', '2'] },
        ]);
    });

    it('should be able to parse a setting directive with a parameter that contains space char.', () => {
        const line = '  @setting key("value another")';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value another'] },
        ]);
    });

    it('should parse an include directive correctly', () => {
        const line = '  @include file(alias)';
        const directive = parseDirective(line) as IncludeDirective;
        expect(directive).toBeInstanceOf(IncludeDirective);
        expect(directive.indent).toBe(2);
        expect(directive.ancestorNode).toBe('file');
        expect(directive.filter).toBe('alias');
    });

    it('should parse a style directive correctly', () => {
        const line = '  @style #element color: red, font-size: 12px';
        const directive = parseDirective(line) as StyleDirective;
        expect(directive).toBeInstanceOf(StyleDirective);
        expect(directive.indent).toBe(2);
        expect(directive.selector).toBe('element');
        expect(directive.styles).toEqual({
            color: 'red',
            'font-size': '12px',
        });
    });

    it('should throw an error for an invalid directive', () => {
        const line = '  @unknown directive';
        expect(() => parseDirective(line)).toThrow(
            parseError('Unknown directive type: unknown')
        );
    });

    it('should throw an error for an invalid include directive', () => {
        const line = '  @include invalid';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid include directive: invalid')
        );
    });

    it('should throw an error for an invalid style directive', () => {
        const line = '  @style #element invalid';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid style syntax: invalid')
        );
    });

    it('should throw an error for an invalid directive format', () => {
        const line = 'invalid directive';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid directive: invalid directive')
        );
    });
});
