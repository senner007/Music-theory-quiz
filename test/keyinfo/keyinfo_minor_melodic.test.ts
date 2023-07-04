import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyinfo, numeral_by_chordNotes } from "../../src/keyinfo/keyInfo";

describe("Test Roman numerals for given chords in - Minor melodic - key", () => {
  const key = keyinfo(Key.minorKey("C"));

  it("should return correct roman numeral", () => {
    expect(numeral_by_chordNotes(key, ["C", "Eb", "G"])).toEqual("i");
    expect(numeral_by_chordNotes(key, ["F", "D", "A"])).toEqual("ii6");
    expect(numeral_by_chordNotes(key, ["B", "G", "Eb"])).toEqual("bIII+64");
    expect(numeral_by_chordNotes(key, ["F", "A", "C", "Eb"])).toEqual("IV7|V7/bVII");
    expect(numeral_by_chordNotes(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(numeral_by_chordNotes(key, ["Eb", "A", "C", "G"])).toEqual("vio43");
    expect(numeral_by_chordNotes(key, ["A", "B", "D", "F"])).toEqual("viio42");
  });
});
