import { TKeyInfo } from "../keyinfo/keyInfo";
import { IProgression } from "../transposition";
import {
  EIntervalDistance,
  TIntervalInteger,
  TNoteAllAccidental,
  TNoteAllAccidentalOctave,
  transpose_to_key,
} from "../utils";
import { LogError } from "../dev-utils";
import { remove_octave, syllables_in_key_of_c } from "../solfege";
import { ISolfegePattern, solfegePatterns } from "./solfegePatterns";
import { TChord } from "../quiz/audiateHarmony";
import { Scale, note } from "@tonaljs/tonal";
import { Conditions } from "./patternConditions";
import { note_transpose, scale_range } from "../tonal-interface";
import { IGlobalConditionsClass, GlobalConditions } from "./globalConditions";
import { IMelodyFragment, IMelodyGeneratorBase, IMelodicPattern, IMelodyGenerator, TMelodyPatterns } from "./melodyGeneratorBase";



export interface IMelodyOptions {
  currentChordFunction: TChord;
  currentChord: readonly TNoteAllAccidentalOctave[];
  keyInfo: TKeyInfo;
  index: number;
  totalIndex: number;
  bass: TNoteAllAccidentalOctave;
  previousGenerator: Omit<IMelodyGenerator, "melody"> | undefined;
  previousMelody: IMelodyFragment[] | undefined;
  nextChordFunction: TChord | undefined;
  nextChord: readonly TNoteAllAccidentalOctave[];
  scale?: string;
}

export function melodyGenerator(
  progression: IProgression,
  melodyPattern: IMelodyGeneratorBase,
  chords: TChord[],
  keyInfo: TKeyInfo,
  scale?: string
): IMelodicPattern {
  let failIndex = 0;

  // Memoization lookup to improve performance of recursive backtracking.
  class Memoize {
    private memoization: Record<string, TMelodyPatterns> = {};

    private createLookup(index: number, prevMelody: IMelodyFragment[] | undefined) {
      return index.toString() + prevMelody?.map((m) => m.note.join("") + m.duration.toString()).join("");
    }

    getMemoized(index: number, prevMelody: IMelodyFragment[] | undefined) {
      const lookup = this.createLookup(index, prevMelody);
      if (this.memoization[lookup]) {
        return this.memoization[lookup];
      }
      return false;
    }

    memoize(index: number, prevMelody: IMelodyFragment[] | undefined, melody: TMelodyPatterns) {
      const lookup = this.createLookup(index, prevMelody);
      this.memoization[lookup] = melody;
    }
  }

  const memoize = new Memoize();

  function outerRecurse(fallbackAllowed: number[]): IMelodyFragment[][] {
    // Recursion with backtracking to try all combinations of patterns. On fail store the index, retry and permit fallback pattern at fail point.
    function recurse(
      currentChord: readonly TNoteAllAccidentalOctave[],
      acc: [IMelodyFragment[], IMelodyGenerator][]
    ): [IMelodyFragment[], IMelodyGenerator][] | boolean {
      const index = acc.length;

      failIndex = index > failIndex ? index : failIndex;

      const previous = acc.last();
      const previousMelody: IMelodyFragment[] | undefined = previous ? previous[0] : undefined;
      const previousGenerator: IMelodyGenerator | undefined = previous ? previous[1] : undefined;

      const args: IMelodyOptions = {
        currentChordFunction: chords[index],
        currentChord: currentChord,
        keyInfo: keyInfo,
        index: index,
        totalIndex: progression.chords.length,
        bass: progression.bass[index],
        previousGenerator: previousGenerator,
        previousMelody: previousMelody,
        nextChordFunction: chords[index + 1],
        nextChord: progression.chords[index + 1],
        scale,
      };

      const generator = new melodyPattern(args);
      let melodies;

      const memoizedMelodies = memoize.getMemoized(index, previousMelody);

      if (memoizedMelodies) {
        melodies = memoizedMelodies;
      } else {
        melodies = generator.melody();
        memoize.memoize(index, previousMelody, melodies);
      }

      if (!melodies) return false;

      const indexBump = index + 1;

      for (const m of melodies) {
        if (m.isFallback && !fallbackAllowed.includes(index)) {
          // return false if melody is fallback and not part of current recursive iteration
          return false;
        }

        if (indexBump === progression.chords.length) {
          // return if all melodies found
          return [...acc, [m.melody, generator]];
        }
        const result = recurse(progression.chords[indexBump], [...acc, [m.melody, generator]]);

        if (result) {
          return result;
        }
      }

      return false;
    }

    const melody = recurse(progression.chords.first_or_throw(), []);

    if (Array.isArray(melody)) {
      return melody.map((o) => o.first());
    } else {
        // throw if the failIndex has not increased. 
        if (fallbackAllowed.includes(failIndex)) {
            LogError(`Failed to create melody at chord index : ${failIndex}`)
        }
      return outerRecurse([...fallbackAllowed, failIndex]); // permit fallback melody where recursion fails.
    }
  }

  const melody = outerRecurse([]);

  return {
    timeSignature: 4, // refactor and include different time signatures
    melodyNotes: melody.flat(),
    bass: progression.bass,
  };
}
