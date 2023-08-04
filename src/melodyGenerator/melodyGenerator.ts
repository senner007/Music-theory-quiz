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
import { Log } from "../logger/logSync";



export interface IMelodyOptions {
  currentChordFunction: TChord;
  currentChord: readonly TNoteAllAccidentalOctave[];
  keyInfo: TKeyInfo;
  index: number;
  totalIndex: number;
  bass: TNoteAllAccidentalOctave;
  previousBass: TNoteAllAccidentalOctave | undefined;
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
  
  // Memoization lookup to improve performance of recursive backtracking.
  class Memoize {
    private memoization: Record<string, TMelodyPatterns> = {};

    private createLookup(index: number, prevMelody: IMelodyFragment[] | undefined) {
      return index.toString() + prevMelody?.map((m) => m.note.join("") + m.duration.toString()).join("");
    }

    getMemoized(index: number, prevMelody: IMelodyFragment[] | undefined) {
      const lookup = this.createLookup(index, prevMelody)
      if (lookup in this.memoization) {
        return { isMemoized : true , melodies : this.memoization[lookup] } as const
      }
      return { isMemoized : false } as const
    }

    memoize(index: number, prevMelody: IMelodyFragment[] | undefined, melody: TMelodyPatterns) {
      const lookup = this.createLookup(index, prevMelody);
      this.memoization[lookup] = melody;
    }
  }

  const memoize = new Memoize();

  function outerRecurse(fallbackAllowed: Set<number>): IMelodyFragment[][] {

    let failIndex = 0;

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
        previousBass : progression.bass[index-1],
        previousGenerator: previousGenerator,
        previousMelody: previousMelody,
        nextChordFunction: chords[index + 1],
        nextChord: progression.chords[index + 1],
        scale,
      };

      const generator = new melodyPattern(args);
      let melodies: TMelodyPatterns

      const memoizedMelodies = memoize.getMemoized(index, previousMelody);

      if (memoizedMelodies.isMemoized) {
        melodies = memoizedMelodies.melodies;
      } else {
        melodies = generator.melody();
        memoize.memoize(index, previousMelody, melodies);
      }

      if (!melodies) return false;

      const indexBump = index + 1;

      for (const m of melodies) {
        if (m.isFallback && !fallbackAllowed.has(index)) {
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

        let fallbackAllowedArray: number[] = []

        // add failIndex to fallbackAllowed if not contained already
        if (!fallbackAllowed.has(failIndex)) {
          fallbackAllowedArray = [...fallbackAllowed, failIndex]
        }

        // handle case where a solution can not be found and so arriving at the same failIndex
        // here we gradually step back and add failIndex from the top until arriving at 0 where error is thrown
        // example : if fallbackAllowed contains: [5,4,1] then add 3 resulting in: [3,1] and retry with fallback patterns at given indexes 
        // if fallbackAllowed contains [3,2,1] then throw error. 
        else {  
          
          const sortedAndReversed = [...fallbackAllowed].sort().to_reverse();

          Log.devLog("Generator debugging:\n")
          Log.devLog(sortedAndReversed)
          
          const indexToAdd = sortedAndReversed.find((n, index) => n -1 !== sortedAndReversed[index +1])! -1;

          fallbackAllowedArray = [...fallbackAllowed, indexToAdd].filter(n => !(n > indexToAdd));

          Log.devLog(fallbackAllowedArray)

          if (indexToAdd === 0) {
            LogError(`Failed to create melody at chord index : ${failIndex}`)
          }

        }
   
       
      return outerRecurse(new Set(fallbackAllowedArray));
    }
  }

  const melody = outerRecurse(new Set<number>([]));

  return {
    timeSignature: 4, // refactor and include different time signatures
    melodyNotes: melody.flat(),
    bass: progression.bass,
  };
}
