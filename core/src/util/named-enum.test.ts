import { A } from 'ts-toolbelt';
import NamedEnum, { aliasableSymbol } from './named-enum';

interface MyEnum {
    hours: number;
}

const MyEnumWeek: MyEnum = { hours: 8 * 5 };
const MyEnumDay: MyEnum = { hours: 8 };
const MyEnumHour: MyEnum = { hours: 1 };

export const MyEnums = NamedEnum({
    WEEK: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
    DAY: { alias: ['day', 'days', 'd'], value: MyEnumDay },
    HOUR: { alias: ['hour', 'hours', 'h'], value: MyEnumHour },
});

export type MyEnumsComp = A.Compute<{
    WEEK: MyEnum;
    DAY: MyEnum;
    HOUR: MyEnum;
    parse: (text: string) => MyEnum | undefined;
}>;

class MyEnum2 {
    private readonly alias: string[];

    [aliasableSymbol](): string[] {
        return this.alias;
    }

    constructor(alias: string[]) {
        this.alias = alias;
    }
}

const MyEnum2Week = new MyEnum2(['week', 'weeks', 'w']);
const MyEnum2Day = new MyEnum2(['day', 'days', 'd']);

export const MyEnum2s = NamedEnum({
    WEEK: MyEnum2Week,
    DAY: MyEnum2Day,
});

export interface MyEnum2sComp {
    WEEK: MyEnum2;
    DAY: MyEnum2;
    parse: (text: string) => MyEnum2 | undefined;
}

it('should has member as define', () => {
    expect(MyEnums.WEEK).toBeDefined();
    expect(MyEnums.DAY).toBeDefined();
    expect(MyEnums.HOUR).toBeDefined();

    expect(MyEnum2s.WEEK).toBeDefined();
    expect(MyEnum2s.DAY).toBeDefined();
    expect(MyEnum2s.parse).toBeDefined();
    expect(MyEnums.parse('not-existed')).toBeUndefined();
});

it('should parse correctly', () => {
    expect(MyEnums.parse('week')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('weeks')).toBe(MyEnums.WEEK);
    expect(MyEnum2s.parse('d')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('days')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('not-existed')).toBeUndefined();
});
