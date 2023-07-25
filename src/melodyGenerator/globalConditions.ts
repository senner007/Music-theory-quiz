import { TKeyInfo } from "../keyinfo/keyInfo";
import { interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_simplify } from "../utils";
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
    globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean  
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
    super(currentFunction, previousFunction, previousNotes, keyInfo, nextChordFunction);
  }

  public globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    return this.hasNoParallelOctavesOrFifths(pattern) && this.resolvesDominant(pattern);
  }

  private resolvesDominant(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    if (this.is_tonic_to_previous_dominant) {
      return this.pattern_includes_dominant_resolution(pattern);
    }
    return true;
  }

  private hasNoParallelOctavesOrFifths(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    if (!pattern) return true;
    if (!this.previousLastNote) return true;

    const distancePrevious = interval_simplify(interval_distance(this.previousBass!, this.previousLastNote));
    const distanceCurrent = interval_simplify(interval_distance(this.bass, pattern.first()));

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
    super(currentFunction, previousFunction, previousNotes, keyInfo, nextChordFunction);
  }

  public globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
    return true;
  }
}
