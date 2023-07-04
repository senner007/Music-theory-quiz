// https://stackoverflow.com/questions/66939607/how-to-make-an-array-of-all-the-strings-in-string-union-type
// credits goes to https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

// credits goes to https://github.com/microsoft/TypeScript/issues/13298#issuecomment-468114901
type UnionToOvlds<U> = UnionToIntersection<
    U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

// credits goes to https://stackoverflow.com/questions/53953814/typescript-check-if-a-type-is-a-union#comment-94748994
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
    ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
    : [T, ...A];

// https://github.com/type-challenges/type-challenges/issues/2988
type ObjectEntries<T, U = Required<T>> = {
    [K in keyof U]: [K, U[K]]
}[keyof U]

type TtoKeysOrValues<T extends any[], N extends 0 | 1> = {
    [key in keyof T]: T[key][N]
}

// This creates type safe object entries, keys and values 
export function ObjectEntries<const Obj extends Record<string, unknown>>(obj: Obj) {
    const entries = Object.entries(obj) as UnionToArray<ObjectEntries<Obj>>
    return {
        entries: entries,
        keys: (entries as any[]).map(o => o.first()),
        values: (entries as any[]).map(o => o.last())
    } as unknown as { entries: typeof entries, keys: TtoKeysOrValues<typeof entries, 0>, values: TtoKeysOrValues<typeof entries, 1> }
}
