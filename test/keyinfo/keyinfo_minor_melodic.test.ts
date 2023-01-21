import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Minor melodic - key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, ["C", "Eb", "G"])).toEqual("i");
    expect(getNumeralBySymbol(key, ["F", "D", "A"])).toEqual("ii6");
    expect(getNumeralBySymbol(key, ["B", "G", "Eb"])).toEqual("bIII+64");
    expect(getNumeralBySymbol(key, ["F", "A", "C", "Eb"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(getNumeralBySymbol(key, ["Eb", "A", "C", "G"])).toEqual("vio43");
    expect(getNumeralBySymbol(key, ["A", "B", "D", "F"])).toEqual("viio42");
  });
});
