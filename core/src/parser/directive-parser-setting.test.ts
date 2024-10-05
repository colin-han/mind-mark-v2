import { SettingDirecitve } from '../model/directive';
import { parseDirective } from './directive-parser';

describe('parseDirective', () => {
    it('should parse a setting directive correctly', () => {
        const line = '  @setting estimation(value)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.directiveType).toBe('setting');
        expect(directive.indent).toBe(2);
        expect(directive.settings[0].definition.name).toBe('estimation');
        expect(directive.settings[0].parameters.format.value).toBe('value');
    });

    it('should parse a setting directive without parameters correctly', () => {
        const line = '  @setting autoNumber';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings[0].definition.name).toBe('autoNumber');
        expect(directive.settings[0].parameters.from.value).toBe('1');
    });

    it('should parse a setting directive without parameters correctly 2', () => {
        const line = '  @setting autoNumber()  ';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings[0].definition.name).toBe('autoNumber');
        expect(directive.settings[0].parameters.from.value).toBe('1');
    });

    it('should be able to parse a setting directive with multiple parameters', () => {
        const line = '  @setting estimation(asLabel useMaxUnit)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings[0].definition.name).toBe('estimation');
        expect(directive.settings[0].parameters.position.value).toBe('asLabel');
        expect(directive.settings[0].parameters.unit.value).toBe('useMaxUnit');
        expect(directive.settings[0].parameters.unitStyle.value).toBe(
            'USE_LONG_UNIT'
        );
    });

    it('should be able to parse a setting directive with multiple settings', () => {
        const line = '  @setting autoNumber, estimation';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings.length).toBe(2);
        expect(directive.settings[0].definition.name).toBe('autoNumber');
        expect(directive.settings[1].definition.name).toBe('estimation');
    });

    it('should be able to parse a setting directive with mulitple setings with multiple parameters', () => {
        const line = '  @setting autoNumber(1), estimation(asLabel useMaxUnit)';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings[0].definition.name).toBe('autoNumber');
        expect(directive.settings[1].definition.name).toBe('estimation');
    });

    it('should be able to parse a setting directive with a parameter that contains space char.', () => {
        const line = '  @setting estimation("value another")';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.settings[0].definition.name).toBe('estimation');
        expect(directive.settings[0].parameters.format.value).toBe(
            'value another'
        );
    });

    it('should support "enable" as a alias for "setting"', () => {
        const line = '  @enable autoNumber';
        const directive = parseDirective(line) as SettingDirecitve;
        expect(directive).toBeInstanceOf(SettingDirecitve);
        expect(directive.directiveType).toBe('setting');
        expect(directive.indent).toBe(2);
        expect(directive.settings[0].definition.name).toBe('autoNumber');
    });

    it('should report error if unknown setting type', () => {
        const line = '  @setting unknown';
        expect(() => parseDirective(line)).toThrow('Unknown setting: unknown');
    });
});
