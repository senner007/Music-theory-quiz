import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { key_info, numeral_by_symbol } from "../../src/keyinfo/keyInfo";

describe("Test Roman numerals for given chords in - Minor melodic - key", () => {
  const key = key_info(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(numeral_by_symbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(numeral_by_symbol(key, ["F", "D", "A"])).toEqual("ii6");
    expect(numeral_by_symbol(key, ["B", "G", "Eb"])).toEqual("bIII+64");
    expect(numeral_by_symbol(key, ["F", "A", "C", "Eb"])).toEqual("IV7|V7/bVII");
    expect(numeral_by_symbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(numeral_by_symbol(key, ["Eb", "A", "C", "G"])).toEqual("vio43");
    expect(numeral_by_symbol(key, ["A", "B", "D", "F"])).toEqual("viio42");
  });
});
