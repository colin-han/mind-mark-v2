import { MyEnum2s, MyEnums } from './NamedEnum.TestType';

it('should has member as define', () => {
    expect(MyEnums.WEEK).toBeDefined();
    expect(MyEnums.DAY).toBeDefined();
    expect(MyEnums.HOUR).toBeDefined();

    expect(MyEnum2s.WEEK).toBeDefined();
    expect(MyEnum2s.DAY).toBeDefined();
    expect(MyEnum2s.parse).toBeDefined();
});

it('should parse correctly', () => {
    expect(MyEnums.parse('week')).toBe(MyEnums.WEEK);
    expect(MyEnums.parse('weeks')).toBe(MyEnums.WEEK);
    expect(MyEnum2s.parse('d')).toBe(MyEnum2s.DAY);
    expect(MyEnum2s.parse('days')).toBe(MyEnum2s.DAY);
});
