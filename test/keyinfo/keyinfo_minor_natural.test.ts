import { it, expect, describe} from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Minor natural - key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(getNumeralBySymbol(key, ["F", "D", "Ab"])).toEqual("iio6");
    expect(getNumeralBySymbol(key, ["Bb", "G", "Eb"])).toEqual("bIII64");
    expect(getNumeralBySymbol(key, ["F", "Ab", "C", "Eb"])).toEqual("iv7");
    expect(getNumeralBySymbol(key, ["Bb", "D", "G", "F"])).toEqual("v65");
    expect(getNumeralBySymbol(key, ["Eb", "Ab", "C", "G"])).toEqual("bVI43");
    expect(getNumeralBySymbol(key, ["Ab", "Bb", "D", "F"])).toEqual("bVII42");
  });
});
