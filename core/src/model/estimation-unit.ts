import NamedEnum, { aliasableSymbol } from '../util/named-enum';

export class EstimationUnit {
    name: string;
    plural: string;
    shorter: string;
    hours: number;

    constructor(name: string, plural: string, shorter: string, hours: number) {
        this.name = name;
        this.plural = plural;
        this.shorter = shorter;
        this.hours = hours;
    }

    [aliasableSymbol]() {
        return [this.name, this.plural, this.shorter];
    }

    toHours(value: number): number {
        return value * this.hours;
    }
}

const MMEstimationUnitWeek = new EstimationUnit('week', 'weeks', 'w', 8 * 5);
const MMEstimationUnitDay = new EstimationUnit('day', 'days', 'd', 8);
const MMEstimationUnitHour = new EstimationUnit('hour', 'hours', 'h', 1);

export const EstimationUnits = NamedEnum({
    WEEK: MMEstimationUnitWeek,
    DAY: MMEstimationUnitDay,
    HOUR: MMEstimationUnitHour,
});
