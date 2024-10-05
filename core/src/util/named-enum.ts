import _ from 'lodash';
import { Assign } from 'utility-types';

export const aliasableSymbol = Symbol('aliasable');

interface AliasableEnumItem {
    [aliasableSymbol]: () => string[];
}

export interface EnumItemDefine<ItemType> {
    alias: string[];
    value: ItemType;
}

export type NamedEnumType<ItemType, Keys extends string> = Assign<
    { [key in Uppercase<Keys>]: ItemType },
    {
        parse(text: string): ItemType | undefined;
        keys(): Keys[];
        alias(): string[];
    }
>;

type AtLeastOne<T> = keyof T extends never ? never : T;

function isAliasable(obj: object): obj is AliasableEnumItem {
    return aliasableSymbol in obj && typeof obj[aliasableSymbol] === 'function';
}
function isAliasableDefs<ItemType extends object, Keys extends string>(
    def:
        | { [key in Keys]: ItemType }
        | { [key in Keys]: EnumItemDefine<ItemType> }
): def is { [key in Keys]: ItemType } {
    const keys = Object.keys(def) as Keys[];
    /* c8 ignore next 3 */
    if (!keys.length) {
        return false;
    }

    const firstElem = def[keys[0]];
    /* c8 ignore next 3 */
    if (typeof firstElem !== 'object') {
        return false;
    }

    return isAliasable(firstElem);
}

function isItemDef(obj: object): obj is EnumItemDefine<unknown> {
    return 'alias' in obj && 'value' in obj;
}

function isItemDefs<ItemType extends object, Keys extends string>(
    def:
        | { [key in Keys]: ItemType }
        | { [key in Keys]: EnumItemDefine<ItemType> }
): def is { [key in Keys]: EnumItemDefine<ItemType> } {
    const keys = Object.keys(def) as Keys[];
    /* c8 ignore next 3 */
    if (!keys.length) {
        return false;
    }

    const firstElem = def[keys[0]];
    /* c8 ignore next 3 */
    if (typeof firstElem !== 'object') {
        return false;
    }

    return isItemDef(firstElem);
}

function NamedEnum<
    DefItemType extends AliasableEnumItem | EnumItemDefine<object> | string[],
    Keys extends string,
    ItemType = DefItemType extends EnumItemDefine<object>
        ? DefItemType['value']
        : DefItemType extends AliasableEnumItem
          ? DefItemType
          : DefItemType extends string[]
            ? Keys
            : never,
>(
    def: AtLeastOne<{ [key in Keys]: DefItemType }>
): NamedEnumType<ItemType, Keys> {
    if (isAliasableDefs(def)) {
        return createNamedEnum(
            def as { [key in Keys]: AliasableEnumItem },
            (enumDef: AliasableEnumItem) => ({
                alias: enumDef[aliasableSymbol](),
                value: enumDef,
            })
        ) as NamedEnumType<ItemType, Keys>;
    } else if (isItemDefs(def)) {
        return createNamedEnum(
            def as { [key in Keys]: EnumItemDefine<ItemType> },
            (enumDef) => ({
                alias: enumDef.alias,
                value: enumDef.value,
            })
        );
    } else {
        return createNamedEnum(
            def as { [key in Keys]: string[] },
            (enumDef, key) => ({
                alias: enumDef,
                value: key as unknown as ItemType,
            })
        );
    }
}

function createNamedEnum<ItemType, DefType, Keys extends string>(
    def: { [key in Keys]: DefType },
    getAliasAndValue: (
        enumDef: DefType,
        key: Keys
    ) => { alias: string[]; value: ItemType }
): NamedEnumType<ItemType, Keys> {
    const result = {} as { [key in Keys]: ItemType };
    const keys: Keys[] = [];
    const nameMap: { [key: string]: ItemType } = {};
    const aliasSet = [] as string[];

    for (const key in def) {
        const { value, alias } = getAliasAndValue(def[key], key);
        if (key in nameMap) {
            throw new Error(`Duplicated key: ${key}`);
        }

        result[key] = value;
        keys.push(key);

        nameMap[key] = value;
        alias.forEach((a) => {
            if (aliasSet.includes(a)) {
                throw new Error(`Duplicated alias: ${a}`);
            }

            const upperA = a.toUpperCase();
            nameMap[upperA] = value;

            aliasSet.push(a);
        });
    }

    const ext = {
        parse: (text: string) => nameMap[text.toUpperCase()],
        keys: () => keys,
        alias: () => aliasSet,
    };

    return _.assign(result, ext) as NamedEnumType<ItemType, Keys>;
}

export default NamedEnum;
