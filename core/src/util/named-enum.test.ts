import NamedEnum, { aliasableSymbol } from './named-enum';

interface MyEnum {
    hours: number;
}

const MyEnumWeek: MyEnum = { hours: 8 * 5 };
const MyEnumDay: MyEnum = { hours: 8 };
const MyEnumHour: MyEnum = { hours: 1 };

const MyEnums = NamedEnum({
    WEEK: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
    DAY: { alias: ['day', 'days', 'd'], value: MyEnumDay },
    HOUR: { alias: ['hour', 'hours', 'h'], value: MyEnumHour },
});

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

const MyEnum2s = NamedEnum({
    WEEK: MyEnum2Week,
    DAY: MyEnum2Day,
});

const MyEnum3s = NamedEnum({
    WEEK: ['week', 'weeks', 'w'],
    DAY: ['day', 'days', 'd'],
});

it('should has member as define', () => {
    expect(MyEnums.WEEK).toBeDefined();
    expect(MyEnums.DAY).toBeDefined();
    expect(MyEnums.HOUR).toBeDefined();

    expect(MyEnum2s.WEEK).toBeDefined();
    expect(MyEnum2s.DAY).toBeDefined();

    expect(MyEnum3s.WEEK).toBeDefined();
    expect(MyEnum3s.DAY).toBeDefined();
});

it('should parse correctly', () => {
    expect(MyEnums.parse('week')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('weeks')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('not-existed')).toBeUndefined();

    expect(MyEnum2s.parse('d')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('days')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('not-existed')).toBeUndefined();

    expect(MyEnum3s.parse('w')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('weeks')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('not-existed')).toBeUndefined();
});

it('should has keys', () => {
    expect(MyEnums.keys()).toEqual(['WEEK', 'DAY', 'HOUR']);
    expect(MyEnum2s.keys()).toEqual(['WEEK', 'DAY']);
    expect(MyEnum3s.keys()).toEqual(['WEEK', 'DAY']);
});

it('should has alias', () => {
    expect(MyEnums.alias()).toMatchObject([
        'week',
        'weeks',
        'w',
        'day',
        'days',
        'd',
        'hour',
        'hours',
        'h',
    ]);
});

it('parse should be case insensitive', () => {
    expect(MyEnums.parse('WEEK')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('week')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('Week')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('wEEK')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('WEEKS')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('WEEKs')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('W')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('w')).toBe(MyEnums.WEEK);

    expect(MyEnum2s.parse('DAY')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('day')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('Day')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('dAY')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('DAYS')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('DaYS')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('D')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('d')).toBe(MyEnum2s.DAY);

    expect(MyEnum3s.parse('WEEK')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('week')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('Week')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('wEEK')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('WEEKS')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('WEEKs')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('W')).toBe(MyEnum3s.WEEK);
    expect(MyEnum3s.parse('w')).toBe(MyEnum3s.WEEK);
});

it('should throw error for duplicate keys', () => {
    expect(() =>
        NamedEnum({
            WEEK: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
            DAY: { alias: ['day', 'days', 'd'], value: MyEnumDay },
            WEEKS: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
        })
    ).toThrow('Duplicated key: WEEKS');
});

it('should throw error for duplicate alias', () => {
    expect(() =>
        NamedEnum({
            WEEK: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
            DAY: { alias: ['day', 'days', 'd'], value: MyEnumDay },
            HOUR: { alias: ['hour', 'hours', 'h', 'h'], value: MyEnumHour },
        })
    ).toThrow('Duplicated alias: h');
});
