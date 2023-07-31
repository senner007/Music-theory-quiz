import { note, Scale } from "@tonaljs/tonal";
import { LogError } from "../dev-utils";
import { remove_octave, syllables_in_key_of_c } from "../solfege";
import { note_transpose, scale_range } from "../tonal-interface";
import { TNoteAllAccidentalOctave, TNoteAllAccidental, EIntervalDistance, transpose_to_key } from "../utils";
import { IGlobalConditionsClass, GlobalConditions } from "./globalConditions";
import { IMelodyOptions } from "./melodyGenerator";
import { Conditions } from "./patternConditions";
import { solfegePatterns } from "./solfegePatterns";
import { TChord } from "../quiz/audiateHarmony";

export interface IMelodicPattern {
  readonly timeSignature: 2 | 3 | 4;
  readonly melodyNotes: IMelodyFragment[];
  readonly bass: readonly TNoteAllAccidentalOctave[];
}

export interface IMelodyFragment {
  note: TNoteAllAccidentalOctave[];
  duration: 1 | 2 | 3 | 4;
}

type TMinorVariant = "natural" | "harmonic" | "melodic";

export type TMelodyPatterns = { isFallback: boolean; melody: IMelodyFragment[] }[] | false;

export interface IMelodyGenerator {
  melody(): TMelodyPatterns;
  chordFunction: ChordFunction;
  bassNote: TNoteAllAccidentalOctave;
}

export interface IMelodyGeneratorBase {
  id: string;
  description: string;
  globalConditions: IGlobalConditionsClass;
  new (options: IMelodyOptions): IMelodyGenerator;
}

export interface IPattern {
  description: (typeof solfegePatterns)[number]["description"];
  conditions: (((solfegePatterns: TNoteAllAccidentalOctave[] | undefined) => boolean) | (() => boolean))[];
  isCadence: boolean;
  isFallback: boolean;
  rhythm: { duration: 1 | 2 | 3 | 4 }[];
}

export interface IPatternCadence {
  description: "cadence";
  returnValue: () => IMelodyFragment[];
}

export abstract class MelodyGeneratorBase implements IMelodyGenerator {
  public chordNotes: ChordNotes;
  public chordFunction: ChordFunction;
  public conditions;
  public bassNote;
  public previousBassNote;
  private previousGenerator;
  public keyInfo;
  private nextChordFunction: ChordFunction | undefined;
  public previousMelody;
  public nextChord;
  private scale;
  public index;
  public totalIndex;

  constructor(IMelodyOptions: IMelodyOptions) {
    this.chordNotes = new ChordNotes(IMelodyOptions.currentChord);
    this.chordFunction = new ChordFunction(
      IMelodyOptions.currentChordFunction,
      IMelodyOptions.keyInfo.tonic as TNoteAllAccidental
    );
    this.previousGenerator = IMelodyOptions.previousGenerator;

    this.keyInfo = IMelodyOptions.keyInfo;
    this.bassNote = IMelodyOptions.bass;
    this.previousBassNote = IMelodyOptions.previousBass;
    this.nextChordFunction = IMelodyOptions.nextChordFunction
      ? new ChordFunction(IMelodyOptions.nextChordFunction, this.keyInfo.tonic as TNoteAllAccidental)
      : undefined;
    this.previousMelody = IMelodyOptions.previousMelody;
    this.conditions = new Conditions(
      this.chordFunction,
      this.previousGenerator?.chordFunction,
      this.previousMelody,
      this.keyInfo,
      this.nextChordFunction,
      this.previousBassNote,
      this.bassNote,
    );

    this.nextChord = IMelodyOptions.nextChord;
    this.scale = IMelodyOptions.scale;
    this.index = IMelodyOptions.index;
    this.totalIndex = IMelodyOptions.totalIndex;
  }

  static globalConditions: IGlobalConditionsClass = GlobalConditions;

  private minor_variant(minorVariant: TMinorVariant): Readonly<TNoteAllAccidental[]> {
    if (this.keyInfo.type !== "minor") {
      LogError("Not minor scale error");
    }
    let obj = {
      natural: this.keyInfo.natural.scale as Readonly<TNoteAllAccidental[]>,
      harmonic: this.keyInfo.harmonic.scale as Readonly<TNoteAllAccidental[]>,
      melodic: this.keyInfo.melodic.scale as Readonly<TNoteAllAccidental[]>,
    } as const;
    return obj[minorVariant];
  }

  private correct_scale_to_fit_non_diatonic_chord(scale: readonly TNoteAllAccidental[]) {
    return scale.map((n) => {
      const noteFromChord = this.chordNotes.all.find((c) => {
        return note(c).letter === note(n).letter;
      });
      if (noteFromChord && remove_octave(noteFromChord) !== n) {
        return remove_octave(noteFromChord);
      }
      return n;
    });
  }

  private progression_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
    let scale: readonly TNoteAllAccidental[];
    if (this.scale) {
      scale = Scale.get(`${this.keyInfo.tonic} ${this.scale}`).notes as TNoteAllAccidental[];
    } else {
      scale = this.key_scale(minorVariant);
    }

    scale = this.correct_scale_to_fit_non_diatonic_chord(scale);
    return scale;
  }

  private key_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
    let scale: readonly TNoteAllAccidental[];
    if (this.keyInfo.type === "minor") {
      scale = this.minor_variant(minorVariant);
    } else {
      scale = this.keyInfo.keyInfo.scale;
    }

    return scale;
  }

  private scale_note_from_range(note: TNoteAllAccidentalOctave, index: number, minorVariant: TMinorVariant) {
    const range = scale_range(
      this.progression_scale(minorVariant),
      note,
      EIntervalDistance.OctaveUp,
      EIntervalDistance.OctaveDown
    );
    const noteIndex = range.findIndex((n) => n === note);
    if (noteIndex === -1) {
      throw new Error("scale note not found");
    }
    return range.at(noteIndex + index) as TNoteAllAccidentalOctave;
  }

  private solfege_syllable(note: TNoteAllAccidentalOctave) {
    const transposedNote = transpose_to_key(note, this.keyInfo.tonic as TNoteAllAccidental);
    return syllables_in_key_of_c[remove_octave(transposedNote)];
  }

  pattern_executor(patternObjs: readonly [...IPattern[]]) {
    const globalConditions = new MelodyGeneratorBase.globalConditions(
      this.chordFunction,
      this.previousGenerator?.chordFunction,
      this.previousMelody,
      this.keyInfo,
      this.nextChordFunction,
      this.previousGenerator?.bassNote,
      this.bassNote
    );

    let melodies: { isFallback: boolean; melody: IMelodyFragment[] }[] = [];
    for (const patternObj of patternObjs) {
      if (patternObj.isCadence !== this.conditions.isCadence) {
        continue;
      }

      const solfegePattern = solfegePatterns.filter((p) => p.description === patternObj.description).first_and_only();

      const notesMinorVariants = (["natural", "harmonic", "melodic"] as TMinorVariant[])
        .map((v) => {
          return solfegePattern.indexes.map((i) => {
            try {
              return this.scale_note_from_range(this.chordNotes.all.at(i.index)!, i.step, v)!;
            } catch (error) {
              return "*";
            }
          });
        })
        .filter((v) => !v.includes("*")) as TNoteAllAccidentalOctave[][];

      for (const pattern of solfegePattern.patterns) {
        const patternMatch = notesMinorVariants.find((v) => {
          const variantSolfege = v.map((n) => this.solfege_syllable(n));
          return variantSolfege.toString() === pattern.toString();
        });

        if (patternMatch) {
          const allConditionsMet = patternObj.conditions.every((condition) => condition(patternMatch));
          const globalConditionsMet = globalConditions?.globalConditionsCheck(patternMatch);

          if (!allConditionsMet || !globalConditionsMet) {
            continue;
          }

          const melody = patternObj.rhythm.map((r, index) => {
            return { note: [patternMatch[index]], duration: r.duration };
          });
          melodies.push({ isFallback: patternObj.isFallback, melody: melody });
        }
      }
    }

    if (melodies.length > 0) {
      return melodies;
    }

    return false;
  }

  abstract melody(): TMelodyPatterns;
}

export class ChordNotes {
  public Soprano;
  public Alto;
  public Tenor;
  public fourth;
  public all: TNoteAllAccidentalOctave[];
  constructor(private chord: readonly TNoteAllAccidentalOctave[]) {
    this.Soprano = chord.at(-1) as TNoteAllAccidentalOctave;
    this.Alto = chord.at(-2) as TNoteAllAccidentalOctave;
    this.Tenor = chord.at(-3) as TNoteAllAccidentalOctave | undefined;
    this.fourth = chord.at(-4) as TNoteAllAccidentalOctave | undefined;
    this.all = chord;
    if (chord.length > 4) {
      LogError("More than 4 chord notes");
    }
  }
}

export class ChordFunction {
  constructor(private chord: TChord, private key: TNoteAllAccidental) {}

  public get isMajor(): boolean {
    return this.chord.quality === "Major";
  }

  public get isDominant(): boolean {
    return (
      note_transpose(this.chord.tonic as TNoteAllAccidental, "4P") === this.key ||
      this.isDominantSeventh ||
      this.isSecondaryDominant
    );
    // TODO the fifth is not always major
  }

  public get isDominantSeventh(): boolean {
    return this.chord.aliases.includes("dom");
  }

  public get isSecondaryDominant(): boolean {
    return this.chord.aliases.includes("secDom");
  }

  public get tonic() {
    return this.chord.tonic as TNoteAllAccidental;
  }

  public get third() {
    const indexOfThirdInterval = this.chord.intervals.findIndex((i) => i === "3M" || i === "3m");
    if (indexOfThirdInterval !== -1) {
      return this.chord.notes.at(indexOfThirdInterval);
    }
    return undefined;
  }

  public get seventh(): TNoteAllAccidental | undefined {
    const indexOfSeventhInterval = this.chord.intervals.findIndex((i) => i === "7M" || i === "7m");
    if (indexOfSeventhInterval !== -1) {
      return this.chord.notes.at(indexOfSeventhInterval);
    }
    return undefined;
  }

  public get leadingNote(): TNoteAllAccidental | undefined {
    return this.isDominant === true ? note_transpose(this.tonic, "3M") : undefined;
  }
}
