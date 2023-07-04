import { expect, vi, describe, test, afterEach, Mock } from "vitest";
import { TProgression, progressions } from "../src/harmony/harmonicProgressions";
import { romanNumeralChord } from "../src/harmony/romanNumerals";
import { keyinfo, numeral_by_chordNotes } from "../src/keyinfo/keyInfo";
import { get_key } from "../src/tonal-interface";

const allProgressions = progressions
  .map(p => p.progressions)
  .flat()


function getRomanNumerals(progression: TProgression) {
  const keyType = get_key("C", progression.isMajor ? "major" : "minor")
  const keyInfo = keyinfo(keyType);
  const progressionChordNotes = {
    chords: progression.chords.map((c) => romanNumeralChord(c)),
    bass: progression.bass,
  };

  return progressionChordNotes.chords.map((n, index: number) => {
    return numeral_by_chordNotes(keyInfo, [progressionChordNotes.bass[index], ...n])
  });
}

  test.each(allProgressions)("should get numerals in key for all progressions", (progression: TProgression) => {
    try {
      expect(getRomanNumerals(progression)).toEqual(expect.arrayContaining([expect.any(String)]));
    } catch (error) {
      throw new Error(`Progression : ${progression.description}\n${error}`)
    }
  });

