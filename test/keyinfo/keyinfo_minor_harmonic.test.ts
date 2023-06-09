import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Minor harmonic - key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(getNumeralBySymbol(key, ["F", "D", "Ab"])).toEqual("iio6");
    expect(getNumeralBySymbol(key, ["B", "G", "Eb"])).toEqual("bIII+64");
    expect(getNumeralBySymbol(key, ["F", "Ab", "C", "Eb"])).toEqual("iv7");
    expect(getNumeralBySymbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(getNumeralBySymbol(key, ["Eb", "Ab", "C", "G"])).toEqual("bVI43|bVIM43");
    expect(getNumeralBySymbol(key, ["Ab", "B", "D", "F"])).toEqual("viio42");
  });
});
