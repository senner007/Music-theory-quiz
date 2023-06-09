import { it, expect, describe} from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyInfo, getNumeralBySymbol } from "../../src/keyInfo";

describe("Test Roman numerals for given chords in minor key", () => {
  const key = keyInfo(Key.minorKey("C"));

  it("should return correct roman numeral for the secondary dominants", () => {
    expect(getNumeralBySymbol(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(getNumeralBySymbol(key, ["F#", "D", "A"])).toEqual("V6/V");
    expect(getNumeralBySymbol(key, ["A", "D", "F#"])).toEqual("V64/V");
    expect(getNumeralBySymbol(key, ["D", "F#", "A", "C"])).toEqual("V7/V");
    expect(getNumeralBySymbol(key, ["F#", "A", "C", "D"])).toEqual("V65/V");
    expect(getNumeralBySymbol(key, ["A", "F#", "C", "D"])).toEqual("V43/V");
    expect(getNumeralBySymbol(key, ["C", "F#", "A", "D"])).toEqual("V42/V");
  });
});
