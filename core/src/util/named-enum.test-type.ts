/* eslint-disable @typescript-eslint/no-unused-vars */
import { A, Test } from 'ts-toolbelt';
import NamedEnum, { aliasableSymbol } from './named-enum';
import { keys } from 'lodash';

const { check, checks } = Test;

it('should parse by {alias: [], value: xxx} correctly', () => {
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

    type MyEnumsComp = A.Compute<{
        WEEK: MyEnum;
        DAY: MyEnum;
        HOUR: MyEnum;
        parse: (text: string) => MyEnum | undefined;
        keys: () => ('WEEK' | 'DAY' | 'HOUR')[];
    }>;

    const _a: MyEnumsComp = MyEnums;
    expect(_a).toBeTruthy();
});

it('should parse by class with [aliasableSymbol] correctly', () => {
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

    interface MyEnum2sComp {
        WEEK: MyEnum2;
        DAY: MyEnum2;
        parse: (text: string) => MyEnum2 | undefined;
        keys: () => ('WEEK' | 'DAY')[];
    }

    const _a: MyEnum2sComp = MyEnum2s;
    expect(_a).toBeTruthy();
});

it('should parse by string array correctly', () => {
    const MyEnum = NamedEnum({
        WEEK: ['week', 'weeks', 'w'],
        DAY: ['day', 'days', 'd'],
    });

    type MyEnumComp = {
        WEEK: 'WEEK' | 'DAY';
        DAY: 'WEEK' | 'DAY';
        parse: (text: string) => 'WEEK' | 'DAY' | undefined;
        keys: () => ('WEEK' | 'DAY')[];
    };

    const _a: MyEnumComp = MyEnum;
});

it('should disallow empty definition', () => {
    //@ts-expect-error options can't be empty
    const MyEmptyEnum = NamedEnum({});
});
