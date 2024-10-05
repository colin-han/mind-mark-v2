import { NumberParameter } from '../util/parameter-definition';
import { buildSetting } from './setting-builder';

export const AutoNumberSetting = buildSetting({
    name: 'autoNumber',
    parameters: {
        from: NumberParameter().defaultValue('1'),
    },
});
