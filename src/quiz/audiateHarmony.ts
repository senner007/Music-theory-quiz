import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { keyinfo, chords_by_chordNotes, resolveAmbiguousChords } from "../keyinfo/keyInfo";
import { INotePlay } from "../midiplay";
import { IQuiz } from "./quiztypes/quiz-types";
import { ITableHeader } from "../solfege";
import { transpose_progression } from "../transposition";
import { TNoteSingleAccidental, to_octave, TIntervalInteger, TNoteAllAccidental } from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { melodyGenerator } from "../melodyGenerator/melodyGenerator";
import { MelodyChordal, MelodyPattern_001, MelodyPattern_002, MelodyTopSingulate } from "../melodyGenerator/melodyPatterns";
import { progression_to_chords, romanNumeralChord } from "../harmony/romanNumerals";
import { get_key, note_transpose } from "../tonal-interface";
import { LogError } from "../dev-utils";

type TOptionType = [
  { name: string, options: TProgression["description"][] },
  { name: string, options: string[] },
  { name: string, options: TNoteSingleAccidental[] }
]

export interface TChord  {
  symbol : string;
  aliases : string[]
  tonic : string,
  intervals: TIntervalInteger[],
  notes : TNoteAllAccidental[]
  quality: "Major" | "Minor" | "Augmented" | "Diminished" | "Unknown"
  type? : string,
} 

export interface TChordRomanNumeral extends TChord  {
  romanNumeral: string;
} 

const melodicPatterns = [
  MelodyTopSingulate,
  MelodyChordal,
  MelodyPattern_001,
  MelodyPattern_002
]

export const AudiateHarmony: IQuiz<TOptionType> = class extends AudiateQuizBase<TOptionType> {
  verify_options(_: TOptionType): boolean {
    return true;
  }

  key: TNoteSingleAccidental;
  chords: TChordRomanNumeral[];
  randomProgressionInKey;
  melody;
  progressionTags;
  progressionDescription;
  progressionIsDiatonic;
  progressionIsMajor;
  keyInfo;
  timeSignature = 4 as const; // from options - input to melody pattern
  constructor(options: Readonly<TOptionType>) {
    super(options);
  
    this.key = options.last()
      .options
      .random_item();

    const selectProgressions = progressions
      .filter(p => options.first()
      .options
      .some(description => description === p.description));
 
    const randomProgression = selectProgressions
      .map(p => p.progressions)
      .flat()
      .random_item();

    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    const keyType = get_key(this.key, this.progressionIsMajor ? "major" : "minor")
    this.keyInfo = keyinfo(keyType);
    
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transpose_progression(randomProgressionInC, this.key);

    try {
      this.chords = progression_to_chords(this.randomProgressionInKey, this.keyInfo)
    } catch (error) {
      const errorMessage = `${error} ${this.progressionDescription} `
      LogError(`${(error as Error).message}\n${errorMessage}`)
    }

    const randomMelodyPatternDescription = options[1].options
      .random_item();

    const melodicPattern = melodicPatterns
      .filter(pattern => pattern.description === randomMelodyPatternDescription)
      .first_and_only()
    
    this.melody = melodyGenerator(
      this.randomProgressionInKey,
      melodicPattern,
      this.chords,
      this.keyInfo
    );
  }

  protected override initTempo: number = 200;

  get quiz_head() {
    const description = this.progressionDescription
      ? `${chalk.underline(this.progressionDescription)}`
      : "";

    const identifiers = this.progressionTags ? `Identifiers : ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [`${this.progressionIsDiatonic
      ? chalk.underline("Diatonic")
      : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(this.key + " " + (this.progressionIsMajor ? "Major" : "Minor"))} (${description}) ${identifiers}`
    ];
  }

  get question() {
    return "";
  }

  audio() {
    const audio = this.melody.melodyNotes.map((n): INotePlay => {
      return { noteNames: n.note, duration: n.duration };
    });

    const audioBass = this.melody.bass.map((n, index): INotePlay => {
      return { noteNames: [n], duration: this.melody.timeSignature };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          to_octave(this.key, "2"),
          to_octave(this.key, "3"),
          to_octave(note_transpose(this.key, this.progressionIsMajor ? "3M" : "3m"), "3"),
          to_octave(note_transpose(this.key, "5P"), "3"),
        ],
        duration: 2,
      } as const,
    ];

    return [
      { audio: audio, keyboardKey: "m", message: "play melody", display: true },
      { audio: [audioBass], keyboardKey: "b", message: "play bass line" },
      { audio: [audio, audioBass], keyboardKey: "space", message: "play melody with bass line" },
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ] as const
  }

  get table_header() {
    return this.chords.map(chord => `${chord.romanNumeral} (${chord.symbol})`)
    .map((c): ITableHeader => {
      return { name: c, duration: this.melody.timeSignature };
    });
  }

  static meta() {
    const commonKeys : TNoteSingleAccidental[] = [ "C", "C#", "Db","D", "Eb", "F", "F#", "Gb", "G", "G#", "Ab", "A", "Bb", "B"] 
    const options = [
      { name: "Progressions", options: progressions.map(p => p.description) as TProgression["description"][] },
      { name: "Melodic Patterns", options: melodicPatterns.map(m => m.description) as string[] },
      { name: "Keys", options: commonKeys },
    ] as const

    return {
      get all_options() {
        return options
      },
      name: "Audiate harmonic progressions",
      description: "Audiate the harmonic progression as solfege degrees",
      instructions: [
        "Audiate various lines using the notes that make the harmony.",
        "Audiate with or without accompaniment.",
        "Also try to include non chord tones, passing tones, suspensions, escape tones, neighbouring tones, appogiatura and anticipation"
      ]
    };
  }
};
