import { it, expect, describe } from "vitest";
import { Key } from "@tonaljs/tonal";
import { keyinfo, numeral_by_chordNotes } from "../../src/keyinfo/keyInfo";

describe("Test Roman numerals for given chords in - Major - key", () => {
  const key = keyinfo(Key.majorKey("C"));

  it("should return correct roman numeral", () => {
    expect(numeral_by_chordNotes(key, ["C", "E", "G"])).toEqual("I");
    expect(numeral_by_chordNotes(key, ["C", "G", "E"])).toEqual("I");
    expect(numeral_by_chordNotes(key, ["E", "G", "C"])).toEqual("I6");
    expect(numeral_by_chordNotes(key, ["E", "C", "G"])).toEqual("I6");
    expect(numeral_by_chordNotes(key, ["G", "C", "E"])).toEqual("I64");
    expect(numeral_by_chordNotes(key, ["G", "E", "C"])).toEqual("I64");
    expect(numeral_by_chordNotes(key, ["D", "F", "A"])).toEqual("ii");
    expect(numeral_by_chordNotes(key, ["D", "A", "F"])).toEqual("ii");
    expect(numeral_by_chordNotes(key, ["F", "D", "A"])).toEqual("ii6");
    expect(numeral_by_chordNotes(key, ["F", "A", "D"])).toEqual("ii6");
    expect(numeral_by_chordNotes(key, ["B", "G", "E"])).toEqual("iii64");
    expect(numeral_by_chordNotes(key, ["F", "A", "C"])).toEqual("IV");
    expect(numeral_by_chordNotes(key, ["F", "C", "A"])).toEqual("IV");
    expect(numeral_by_chordNotes(key, ["F", "A", "C", "E"])).toEqual("IV7");
    expect(numeral_by_chordNotes(key, ["F", "C", "A", "E"])).toEqual("IV7");
    expect(numeral_by_chordNotes(key, ["F", "E", "A", "C"])).toEqual("IV7");
    expect(numeral_by_chordNotes(key, ["F", "E", "C", "A"])).toEqual("IV7");
    expect(numeral_by_chordNotes(key, ["A", "C", "F", "E"])).toEqual("IV65");
    expect(numeral_by_chordNotes(key, ["G", "B", "D", "F"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "D", "B", "F"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "F", "D", "B"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "F", "B", "D"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "F", "B"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "B", "F"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["G", "D", "F", "B"])).toEqual("V7");
    expect(numeral_by_chordNotes(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(numeral_by_chordNotes(key, ["B", "D", "G", "F"])).toEqual("V65");
    expect(numeral_by_chordNotes(key, ["D", "F", "G", "B"])).toEqual("V43");
    expect(numeral_by_chordNotes(key, ["E", "A", "C", "G"])).toEqual("vi43");
    expect(numeral_by_chordNotes(key, ["B", "A", "B", "D"])).toEqual("vii7");
    expect(numeral_by_chordNotes(key, ["A", "B", "D", "F"])).toEqual("viio42");
    expect(numeral_by_chordNotes(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(numeral_by_chordNotes(key, ["C", "E", "G", "Bb"])).toEqual("V7/IV");
    expect(numeral_by_chordNotes(key, ["A", "C#", "E", "G"])).toEqual("V7/ii");
    expect(numeral_by_chordNotes(key, ["D#", "F#", "A", "B"])).toEqual("V65/iii");
    expect(numeral_by_chordNotes(key, ["G", "Bb", "C", "E"])).toEqual("V43/IV");
    expect(numeral_by_chordNotes(key, ["C", "D", "F#", "A"])).toEqual("V42/V");
    expect(numeral_by_chordNotes(key, ["E", "D", "E", "G#"])).toEqual("V7/vi");
  });

  it("should return correct roman numeral for the secondary dominants", () => {
    expect(numeral_by_chordNotes(key, ["D", "F#", "A"])).toEqual("V/V");
    expect(numeral_by_chordNotes(key, ["F#", "D", "A"])).toEqual("V6/V");
    expect(numeral_by_chordNotes(key, ["A", "D", "F#"])).toEqual("V64/V");
    expect(numeral_by_chordNotes(key, ["D", "F#", "A", "C"])).toEqual("V7/V");
    expect(numeral_by_chordNotes(key, ["F#", "A", "C", "D"])).toEqual("V65/V");
    expect(numeral_by_chordNotes(key, ["A", "F#", "C", "D"])).toEqual("V43/V");
    expect(numeral_by_chordNotes(key, ["C", "F#", "A", "D"])).toEqual("V42/V");
    expect(numeral_by_chordNotes(key, ["C", "E", "G", "Bb"])).toEqual("V7/IV");
    expect(numeral_by_chordNotes(key, ["A", "C#", "E", "G"])).toEqual("V7/ii");
    expect(numeral_by_chordNotes(key, ["D#", "F#", "A", "B"])).toEqual("V65/iii");
    expect(numeral_by_chordNotes(key, ["G", "Bb", "C", "E"])).toEqual("V43/IV");
    expect(numeral_by_chordNotes(key, ["C", "D", "F#", "A"])).toEqual("V42/V");
    expect(numeral_by_chordNotes(key, ["E", "D", "E", "G#"])).toEqual("V7/vi");
  });
});