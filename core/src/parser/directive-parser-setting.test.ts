import { SettingDirecitve } from '../model/directive';
import { parseDirective } from './directive-parser';

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

    it('should support "enable" as a alias for "setting"', () => {
        const line = '  @enable key(value)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.directiveType).toBe('setting');
        expect(directive.indent).toBe(2);
        expect(directive.settings).toMatchObject([
            { name: 'key', parameters: ['value'] },
        ]);
    });
});
