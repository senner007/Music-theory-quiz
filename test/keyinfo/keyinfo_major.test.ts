import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Major - key", () => {
  const key = keyInfo(Key.majorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, ["C", "E", "G"])).toEqual("I");
    expect(getNumeralBySymbol(key, ["F", "D", "A"])).toEqual("ii6");
    expect(getNumeralBySymbol(key, ["B", "G", "E"])).toEqual("iii64");
    expect(getNumeralBySymbol(key, ["F", "A", "C", "E"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(getNumeralBySymbol(key, ["E", "A", "C", "G"])).toEqual("vi43");
    expect(getNumeralBySymbol(key, ["A", "B", "D", "F"])).toEqual("viio42");
    expect(getNumeralBySymbol(key, ["A", "C#", "E", "G"])).toEqual("V7/ii");
    expect(getNumeralBySymbol(key, ["D#", "F#", "A", "B"])).toEqual("V65/iii");
    expect(getNumeralBySymbol(key, ["G", "Bb", "C", "E"])).toEqual("V43/IV");
    expect(getNumeralBySymbol(key, ["C", "D", "F#", "A"])).toEqual("V42/V");
  });
});