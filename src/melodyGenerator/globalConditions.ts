import { TKeyInfo } from "../keyinfo/keyInfo";
import { interval_direction, interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_integer_absolute, interval_simplify } from "../utils";
import { ChordFunction, IMelodyFragment } from "./melodyGeneratorBase";
import { Conditions } from "./patternConditions";

export interface IGlobalConditionsClass {
  id: string;
  new (
    currentFunction: ChordFunction,
    previousFunction: ChordFunction | undefined,
    previousNotes: readonly IMelodyFragment[] | undefined,
    keyInfo: TKeyInfo,
    nextChordFunction: ChordFunction | undefined,
    previousBass: TNoteAllAccidentalOctave | undefined,
    bass: TNoteAllAccidentalOctave
  ): IGlobalConditions;
}

export interface IGlobalConditions {
  globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean;
}

export class GlobalConditions extends Conditions implements IGlobalConditions {
  static id = "GlobalConditions"; // TODO : this should be type safe - move json to ts
  constructor(
    currentFunction: ChordFunction,
    previousFunction: ChordFunction | undefined,
    previousNotes: readonly IMelodyFragment[] | undefined,
    keyInfo: TKeyInfo,
    nextChordFunction: ChordFunction | undefined,
    private previousBass: TNoteAllAccidentalOctave | undefined,
    private bass: TNoteAllAccidentalOctave
  ) {
    super(currentFunction, previousFunction, previousNotes, keyInfo, nextChordFunction, previousBass, bass);
  }

  public globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    return (
      this.hasNoParallelOctavesOrFifths(pattern) 
      && this.resolvesPreviousDominant(pattern)
      && this.noDirectMotionLeapsToPerfectIntervals(pattern)
    );
  }

  private resolvesPreviousDominant(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    if (this.is_tonic_to_previous_dominant) {
      return this.pattern_includes_dominant_resolution(pattern);
    }
    return true;
  }

  private noDirectMotionLeapsToPerfectIntervals(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    if (!this.previousMelody) return true;
    if (!pattern) return true;
    if (!this.previousBassNote) return true;

    // If melody moves by step
    if (interval_integer_absolute(this.previousMelody.last_or_throw().note.last_or_throw(), pattern.first_or_throw()) === 2) {
      return true;
    }

    // If bass moves by step
    if (interval_integer_absolute(this.previousBassNote , this.bassNote) === 2) {
      return true;
    }

    // If melody not is the same
    if (this.previousMelody.last_or_throw().note.last_or_throw() === pattern.first_or_throw()) {
      return true;
    }

    // If bass note is same
    if (this.previousBassNote === this.bassNote) {
      return true;
    }

    const melodyMotion = interval_direction(
      interval_distance(this.previousMelody.last_or_throw().note.last_or_throw(), pattern.first_or_throw())
    );

    const bassMotion = interval_direction(interval_distance(this.previousBassNote, this.bassNote));
    const distanceCurrent = interval_simplify(interval_distance(this.bass, pattern.first_or_throw()));
    const isDirectMotion = melodyMotion === bassMotion;
    if (isDirectMotion && (distanceCurrent === "8P" || distanceCurrent === "1P" || distanceCurrent === "5P")) {
      return false;
    }

    return true;
  }

  private hasNoParallelOctavesOrFifths(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    if (!pattern) return true;
    if (!this.previousLastNote) return true;

    const distancePrevious = interval_simplify(interval_distance(this.previousBass!, this.previousLastNote));
    const distanceCurrent = interval_simplify(interval_distance(this.bass, pattern.first_or_throw()));

    if (
      (distancePrevious === "1P" || distancePrevious === "5P" || distancePrevious === "8P") &&
      distancePrevious === distanceCurrent
    ) {
      return false;
    }

    // hidden parallels
    if (
      (distancePrevious === "1P" && distanceCurrent === "8P") ||
      (distancePrevious === "8P" && distanceCurrent === "1P")
    ) {
      return false;
    }

    return true;
  }
}

export class NoVoiceLeadning extends Conditions implements IGlobalConditions {
  static id = "NoVoiceLeading";
  constructor(
    currentFunction: ChordFunction,
    previousFunction: ChordFunction | undefined,
    previousNotes: readonly IMelodyFragment[] | undefined,
    keyInfo: TKeyInfo,
    nextChordFunction: ChordFunction | undefined,
    private previousBass: TNoteAllAccidentalOctave | undefined,
    private bass: TNoteAllAccidentalOctave
  ) {
    super(currentFunction, previousFunction, previousNotes, keyInfo, nextChordFunction, previousBass, bass);
  }

  public globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    return true;
  }
}
