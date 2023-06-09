import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in - Major - key", () => {
  const key = keyInfo(Key.majorKey("C"));

  it("should return correct roman numeral", () => {
    expect(getNumeralBySymbol(key, ["C", "E", "G"])).toEqual("I");
    expect(getNumeralBySymbol(key, ["C", "G", "E"])).toEqual("I");
    expect(getNumeralBySymbol(key, ["E", "G", "C"])).toEqual("I6");
    expect(getNumeralBySymbol(key, ["E", "C", "G"])).toEqual("I6");
    expect(getNumeralBySymbol(key, ["G", "C", "E"])).toEqual("I64");
    expect(getNumeralBySymbol(key, ["G", "E", "C"])).toEqual("I64");
    expect(getNumeralBySymbol(key, ["D", "F", "A"])).toEqual("ii");
    expect(getNumeralBySymbol(key, ["D", "A", "F"])).toEqual("ii");
    expect(getNumeralBySymbol(key, ["F", "D", "A"])).toEqual("ii6");
    expect(getNumeralBySymbol(key, ["F", "A", "D"])).toEqual("ii6");
    expect(getNumeralBySymbol(key, ["B", "G", "E"])).toEqual("iii64");
    expect(getNumeralBySymbol(key, ["F", "A", "C"])).toEqual("IV");
    expect(getNumeralBySymbol(key, ["F", "C", "A"])).toEqual("IV");
    expect(getNumeralBySymbol(key, ["F", "A", "C", "E"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["F", "C", "A", "E"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["F", "E", "A", "C"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["F", "E", "C", "A"])).toEqual("IV7");
    expect(getNumeralBySymbol(key, ["A", "C", "F", "E"])).toEqual("IV65");
    expect(getNumeralBySymbol(key, ["G", "B", "D", "F"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "D", "B", "F"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "F", "D", "B"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "F", "B", "D"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "F", "B"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "B", "F"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["G", "D", "F", "B"])).toEqual("V7");
    expect(getNumeralBySymbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(getNumeralBySymbol(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(getNumeralBySymbol(key, ["D", "F", "G", "B"])).toEqual("V43");
    expect(getNumeralBySymbol(key, ["E", "A", "C", "G"])).toEqual("vi43");
    expect(getNumeralBySymbol(key, ["B", "A", "B", "D"])).toEqual("vii7");
    expect(getNumeralBySymbol(key, ["A", "B", "D", "F"])).toEqual("viio42");
    expect(getNumeralBySymbol(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(getNumeralBySymbol(key, ["C", "E", "G", "Bb"])).toEqual("V7/IV");
    expect(getNumeralBySymbol(key, ["A", "C#", "E", "G"])).toEqual("V7/ii");
    expect(getNumeralBySymbol(key, ["D#", "F#", "A", "B"])).toEqual("V65/iii");
    expect(getNumeralBySymbol(key, ["G", "Bb", "C", "E"])).toEqual("V43/IV");
    expect(getNumeralBySymbol(key, ["C", "D", "F#", "A"])).toEqual("V42/V");
    expect(getNumeralBySymbol(key, ["E", "D", "E", "G#"])).toEqual("V7/vi");
  });

  it("should return correct roman numeral for the secondary dominants", () => {
    expect(getNumeralBySymbol(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(getNumeralBySymbol(key, ["F#", "D", "A"])).toEqual("V6/V");
    expect(getNumeralBySymbol(key, ["A", "D", "F#"])).toEqual("V64/V");
    expect(getNumeralBySymbol(key, ["D", "F#", "A", "C"])).toEqual("V7/V");
    expect(getNumeralBySymbol(key, ["F#", "A", "C", "D"])).toEqual("V65/V");
    expect(getNumeralBySymbol(key, ["A", "F#", "C", "D"])).toEqual("V43/V");
    expect(getNumeralBySymbol(key, ["C", "F#", "A", "D"])).toEqual("V42/V");
    expect(getNumeralBySymbol(key, ["C", "E", "G", "Bb"])).toEqual("V7/IV");
    expect(getNumeralBySymbol(key, ["A", "C#", "E", "G"])).toEqual("V7/ii");
    expect(getNumeralBySymbol(key, ["D#", "F#", "A", "B"])).toEqual("V65/iii");
    expect(getNumeralBySymbol(key, ["G", "Bb", "C", "E"])).toEqual("V43/IV");
    expect(getNumeralBySymbol(key, ["C", "D", "F#", "A"])).toEqual("V42/V");
    expect(getNumeralBySymbol(key, ["E", "D", "E", "G#"])).toEqual("V7/vi");
  });
});