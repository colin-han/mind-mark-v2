import { O } from "ts-toolbelt";

export const aliasableSymbol = Symbol('aliasable');

interface AliasableEnumItem {
    [aliasableSymbol]: () => string[];
}

export interface EnumItemDefine<ItemType> {
    alias: string[],
    value: ItemType
}

type NamedEnumType<ItemType, Keys extends string> = O.Merge<
    { [key in Keys]: ItemType },
    { parse(text: string): ItemType | undefined }
>;

type AtLeastOne<T> = keyof T extends never ? never : T;

function isAliasable(obj: object): obj is AliasableEnumItem {
    return aliasableSymbol in obj && typeof obj[aliasableSymbol] === 'function';
}
function isAliasableDefs<ItemType extends object, Keys extends string>(
    def: { [key in Keys]: ItemType } | { [key in Keys]: EnumItemDefine<ItemType> }
): def is { [key in Keys]: ItemType } {
    const keys = Object.keys(def) as Keys[];
    if (!keys.length) {
        return false;
    }

    const firstElem = def[keys[0]];
    if (typeof firstElem !== 'object') {
        return false;
    }

    return isAliasable(firstElem);
}

function NamedEnum<
    DefItemType extends AliasableEnumItem | EnumItemDefine<object>,
    Keys extends string,
    ItemType = DefItemType extends EnumItemDefine<object>
    ? DefItemType['value']
    : DefItemType extends AliasableEnumItem
    ? DefItemType
    : never
>(def: AtLeastOne<{ [key in Keys]: DefItemType }>): NamedEnumType<ItemType, Keys> {
    if (isAliasableDefs(def)) {
        return _NamedEnumByAliasable(def as { [key in Keys]: AliasableEnumItem }) as NamedEnumType<ItemType, Keys>;
    } else {
        return _NamedEnumByDefs(def as { [key in Keys]: EnumItemDefine<ItemType> });
    }
}


// function NamedEnum<ItemType extends AliasableEnumItem, Keys extends string>(def: AtLeastOne<{ [key in Keys]: ItemType }>): NamedEnumType<ItemType, Keys>;
// function NamedEnum<ItemType, Keys extends string>(def: AtLeastOne<{ [key in Keys]: EnumItemDefine<ItemType> }>): NamedEnumType<ItemType, Keys>;
// function NamedEnum<ItemType, Keys extends string>(
//   def: ItemType extends AliasableEnumItem ? AtLeastOne<{ [key in Keys]: ItemType }> : AtLeastOne<{ [key in Keys]: EnumItemDefine<ItemType> }>
// ): NamedEnumType<ItemType, Keys> {
//   if (isAliasableDefs(def)) {
//     return _NamedEnumByAliasable(def as { [key in Keys]: AliasableEnumItem }) as NamedEnumType<ItemType, Keys>;
//   } else {
//     return _NamedEnumByDefs(def as { [key in Keys]: EnumItemDefine<ItemType> });
//   }
// }

export function _NamedEnumByAliasable<
    ItemType extends AliasableEnumItem,
    Keys extends string
>(def: { [key in Keys]: ItemType }): NamedEnumType<ItemType, Keys> {
    const result = {
        parse(text: string): ItemType | undefined {
            for (const key in def) {
                const enumDef = def[key];
                if (enumDef[aliasableSymbol]().includes(text)) {
                    return enumDef;
                }
            }
            return undefined;
        }
    } as NamedEnumType<ItemType, Keys>;

    for (const key in def) {
        const enumDef = def[key];
        (result as { [key in Keys]: ItemType })[key] = enumDef;
    }
    return result;
}

function _NamedEnumByDefs<ItemType, Keys extends string>(def: { [key in Keys]: EnumItemDefine<ItemType> }): NamedEnumType<ItemType, Keys> {
    const result = {
        parse(text: string): ItemType | undefined {
            for (const key in def) {
                const enumDef = def[key];
                if (enumDef.alias.includes(text)) {
                    return enumDef.value;
                }
            }
            return undefined;
        }
    } as NamedEnumType<ItemType, Keys>;

    for (const key in def) {
        const enumDef = def[key];
        (result as { [key in Keys]: ItemType })[key] = enumDef.value;
    }
    return result;
}
export default NamedEnum;