import { it, expect, describe} from "vitest";
import { Key } from "@tonaljs/tonal";
import { key_info, numeral_by_symbol } from "../../src/keyinfo/keyInfo";

describe("Test Roman numerals for given chords in - Minor natural - key", () => {
  const key = key_info(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(numeral_by_symbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(numeral_by_symbol(key, ["F", "D", "Ab"])).toEqual("iio6");
    expect(numeral_by_symbol(key, ["Bb", "G", "Eb"])).toEqual("bIII64");
    expect(numeral_by_symbol(key, ["F", "Ab", "C", "Eb"])).toEqual("iv7");
    expect(numeral_by_symbol(key, ["Bb", "D", "G", "F"])).toEqual("v65");
    expect(numeral_by_symbol(key, ["Eb", "Ab", "C", "G"])).toEqual("bVI43|bVIM43"); // Investigate !
    expect(numeral_by_symbol(key, ["Ab", "Bb", "D", "F"])).toEqual("bVII42");
  });

  it("should return correct roman numeral for the secondary dominants", () => {
    expect(numeral_by_symbol(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(numeral_by_symbol(key, ["F#", "D", "A"])).toEqual("V6/V");
    expect(numeral_by_symbol(key, ["A", "D", "F#"])).toEqual("V64/V");
    expect(numeral_by_symbol(key, ["D", "F#", "A", "C"])).toEqual("V7/V");
    expect(numeral_by_symbol(key, ["F#", "A", "C", "D"])).toEqual("V65/V");
    expect(numeral_by_symbol(key, ["A", "F#", "C", "D"])).toEqual("V43/V");
    expect(numeral_by_symbol(key, ["C", "F#", "A", "D"])).toEqual("V42/V");
  });
});
