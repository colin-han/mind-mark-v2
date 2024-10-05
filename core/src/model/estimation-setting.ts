import NamedEnum from '../util/named-enum';
import {
    AnonymousParameter,
    EnumParameter,
} from '../util/parameter-definition';
import { buildSetting } from './setting-builder';

export const EstimationPositions = NamedEnum({
    AS_LABEL: ['asLabel'],
});

export const EstimationTranslateUseUnits = NamedEnum({
    USE_MIN_UNIT: ['useMinUnit'],
    USE_MAX_UNIT: ['useMaxUnit'],
});

export const EstimationTranslateUnitStyles = NamedEnum({
    USE_LONG_UNIT: ['useLongUnit'],
    USE_SHORT_UNIT: ['useShortUnit'],
});

export const EstimationSetting = buildSetting({
    name: 'estimation',
    inheritalbe: true,
    parameters: {
        position: EnumParameter(EstimationPositions).defaultValue(
            EstimationPositions.AS_LABEL
        ),
        unit: EnumParameter(EstimationTranslateUseUnits).defaultValue(
            EstimationTranslateUseUnits.USE_MIN_UNIT
        ),
        unitStyle: EnumParameter(EstimationTranslateUnitStyles).defaultValue(
            EstimationTranslateUnitStyles.USE_LONG_UNIT
        ),
        format: AnonymousParameter().defaultValue('⏰ %s'),
    },
});
