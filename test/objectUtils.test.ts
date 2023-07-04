import { expect, vi, describe, test, afterEach, Mock, it } from "vitest";
import type { Equal, Expect } from '@type-challenges/utils'
import { ObjectEntries } from "../src/objectUtils";

describe("Test ObjectEntries method", () => {
    const object1 = {
        a: 'somestring',
        b: 42,
        c: true
    } as const;

    const objectEntries = ObjectEntries(object1)

    it("should return entries, keys and values from object", () => {

        expect(objectEntries.entries).toEqual([["a", "somestring"], ["b", 42], ["c", true]]);
        expect(objectEntries.keys).toEqual(["a", "b", "c"]);
        expect(objectEntries.values).toEqual(["somestring", 42, true]);

    });

    it("should compile correct types", () => {
        type cases = [
            Expect<Equal<typeof objectEntries["entries"], [["a", "somestring"], ["b", 42], ["c", true]]>>,
            Expect<Equal<typeof objectEntries["keys"], ["a", "b", "c"]>>,
            Expect<Equal<typeof objectEntries["values"], ["somestring", 42, true]>>
        ]

        expect(true).toEqual(true);
    });
});