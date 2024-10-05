import { parseSetting } from './setting-parser';
import { SettingDefinitions } from '../model/settings';
import { parseError } from '../util/errors';
import { buildSetting } from '../model/setting-builder';
import NamedEnum from '../util/named-enum';
import {
    AnonymousParameter,
    EnumParameter,
} from '../util/parameter-definition';

const MyEnums = NamedEnum({
    VALUE1: ['value1'],
    VALUE2: ['value2'],
});

const MyEnums2 = NamedEnum({
    TEST1: ['test1'],
    TEST2: ['test2'],
    TEST3: ['test3'],
});

const MyEnums3 = NamedEnum({
    A: ['a'],
    B: ['b'],
});

describe('parseSetting', () => {
    beforeAll(() => {
        // Mock SettingDefinitions
        SettingDefinitions['testSetting'] = buildSetting({
            name: 'testSetting',
            parameters: {
                param1: EnumParameter(MyEnums).defaultValue(MyEnums.VALUE1),
                param2: EnumParameter(MyEnums2)
                    .defaultValue(MyEnums2.TEST1)
                    .allowMultiple(),
                param3: AnonymousParameter().defaultValue('default'),
                param4: EnumParameter(MyEnums3).allowMultiple(),
            },
        });
    });

    it('should parse a valid setting line', () => {
        const line = 'testSetting(VALUE2 customValue)';
        const result = parseSetting(line);
        expect(result.definition).toBe(SettingDefinitions['testSetting']);
        expect(result.parameters.param1.value).toBe('VALUE2');
        expect(result.parameters.param2.value).toStrictEqual(['TEST1']);
        expect(result.parameters.param3.value).toBe('customValue');
        expect(result.parameters.param4.value).toStrictEqual([]);
    });

    it('should parse allowMultiple parameter as array', () => {
        const line = 'testSetting(VALUE2 test1 test2)';
        const result = parseSetting(line);
        expect(result.parameters.param2.value).toEqual(['test1', 'test2']);
    });

    it('should throw an error for an invalid setting line', () => {
        const line = 'invalidSetting';
        expect(() => parseSetting(line)).toThrow(
            parseError(`Unknown setting: ${line}`)
        );
    });

    it('should throw an error for an unknown setting', () => {
        const line = 'unknownSetting()';
        expect(() => parseSetting(line)).toThrow(
            parseError(`Unknown setting: unknownSetting`)
        );
    });

    it('should use default values for missing parameters', () => {
        const line = 'testSetting()';
        const result = parseSetting(line);
        expect(result.parameters.param1.value).toBe('VALUE1');
        expect(result.parameters.param3.value).toBe('default');
    });

    it('should handle anonymous parameters', () => {
        const line = 'testSetting(customValue)';
        const result = parseSetting(line);
        expect(result.parameters.param3.value).toBe('customValue');
    });

    it('should throw an error for duplicate parameters', () => {
        const line = 'testSetting(VALUE2 VALUE1)';
        expect(() => parseSetting(line)).toThrow(
            parseError(`Duplicate parameter: param1`)
        );
    });

    afterAll(() => {
        // Clean up mock
        delete SettingDefinitions['testSetting'];
    });
});
