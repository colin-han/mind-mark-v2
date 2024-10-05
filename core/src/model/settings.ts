import { ParameterDefinition } from '../util/parameter-definition';
import { AutoNumberSetting } from './auto-number-setting';
import { EstimationSetting } from './estimation-setting';
import { SettingDefinition } from './setting-builder';

export interface SettingParameter {
    definition: ParameterDefinition;
    value: string | string[] | undefined;
    isSet: boolean;
}
export interface Setting {
    definition: SettingDefinition;
    parameters: Record<string, SettingParameter>;
}

export const SettingDefinitions: Record<string, SettingDefinition> = {
    autoNumber: AutoNumberSetting,
    estimation: EstimationSetting,
};
