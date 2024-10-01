import { A, Test } from "ts-toolbelt";
import NamedEnum, { aliasableSymbol } from "./NamedEnum";

const { check, checks } = Test;

interface MyEnum {
  hours: number;
}

const MyEnumWeek: MyEnum = { hours: 8 * 5 };
const MyEnumDay: MyEnum = { hours: 8 };
const MyEnumHour: MyEnum = { hours: 1 };

export const MyEnums = NamedEnum({
  WEEK: { alias: ['week', 'weeks', 'w'], value: MyEnumWeek },
  DAY: { alias: ['day', 'days', 'd'], value: MyEnumDay },
  HOUR: { alias: ['hour', 'hours', 'h'], value: MyEnumHour }
});

export type MyEnumsComp = A.Compute<{
  WEEK: MyEnum;
  DAY: MyEnum;
  HOUR: MyEnum;
  parse: (text: string) => MyEnum | undefined;
}>

class MyEnum2 {
  private alias: string[];

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
  DAY: MyEnum2Day
});

export interface MyEnum2sComp {
  WEEK: MyEnum2;
  DAY: MyEnum2;
  parse: (text: string) => MyEnum2 | undefined;
}

checks([
  check<typeof MyEnums, MyEnumsComp, Test.Pass>()
]);

checks([
  check<typeof MyEnum2s, MyEnum2sComp, Test.Pass>()
]);
