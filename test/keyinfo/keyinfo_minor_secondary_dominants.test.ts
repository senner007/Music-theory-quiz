import { it, expect, describe} from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyinfo, numeral_by_chordNotes } from "../../src/keyinfo/keyInfo";

describe("Test Roman numerals for given chords in minor key", () => {
  const key = keyinfo(Key.minorKey("C"));

  it("should return correct roman numeral for the secondary dominants", () => {
    expect(numeral_by_chordNotes(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(numeral_by_chordNotes(key, ["F#", "D", "A"])).toEqual("V6/V");
    expect(numeral_by_chordNotes(key, ["A", "D", "F#"])).toEqual("V64/V");
    expect(numeral_by_chordNotes(key, ["D", "F#", "A", "C"])).toEqual("V7/V");
    expect(numeral_by_chordNotes(key, ["F#", "A", "C", "D"])).toEqual("V65/V");
    expect(numeral_by_chordNotes(key, ["A", "F#", "C", "D"])).toEqual("V43/V");
    expect(numeral_by_chordNotes(key, ["C", "F#", "A", "D"])).toEqual("V42/V");
  });
});
