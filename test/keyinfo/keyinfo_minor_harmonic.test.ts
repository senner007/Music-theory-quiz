import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { key_info, numeral_by_symbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Minor harmonic - key", () => {
  const key = key_info(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(numeral_by_symbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(numeral_by_symbol(key, ["F", "D", "Ab"])).toEqual("iio6");
    expect(numeral_by_symbol(key, ["B", "G", "Eb"])).toEqual("bIII+64");
    expect(numeral_by_symbol(key, ["F", "Ab", "C", "Eb"])).toEqual("iv7");
    expect(numeral_by_symbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(numeral_by_symbol(key, ["Eb", "Ab", "C", "G"])).toEqual("bVI43|bVIM43");
    expect(numeral_by_symbol(key, ["Ab", "B", "D", "F"])).toEqual("viio42");
  });
});
