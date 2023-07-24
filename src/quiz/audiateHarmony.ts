import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { keyinfo, chords_by_chordNotes, resolveAmbiguousChords } from "../keyinfo/keyInfo";
import { INotePlay } from "../midiplay";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import { ITableHeader } from "../solfege";
import { transpose_progression } from "../transposition";
import { TNoteSingleAccidental, to_octave, TIntervalInteger, TNoteAllAccidental, commonKeys } from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { IMelodyGeneratorBase, melodyGenerator, MelodyGeneratorBase } from "../melodyGenerator/melodyGenerator";
import {
  MelodyChordal,
  MelodyPattern_001,
  MelodyPattern_002,
  MelodyPattern_003,
  MelodyTopSingulate,
} from "../melodyGenerator/melodyPatterns";
import { progression_to_chords, romanNueralDict } from "../harmony/romanNumerals";
import { get_key, note_transpose } from "../tonal-interface";
import { LogError } from "../dev-utils";

class Options {
  private static progressions = {
    name: "Progressions",
    options: () => progressions.map((p) => p.description) as TProgression["description"][],
    cliShort: "ps",
  };

  private static melodicPatterns = {
    name: "Melodic Patterns",
    options: (prev: TOptionsReturnType<IQuizOptions[]> | undefined) => {
      if (!prev) {
        LogError(`Conditional options depends on previous options at ${this.melodicPatterns.name}`);
      }
      const progressionsOptions = prev.filter((p) => p.name === this.progressions.name).first_and_only().options;
      const ps = progressions
        .filter((ps) => progressionsOptions.includes(ps.description))
        .map((p) => p.progressions)
        .flat();

      return melodicPatterns
        .filter((m) => {
          return ps.some((p) => (!p.voiceLeading ? true : p.voiceLeading.includes(m.globalConditions.id)));
        })
        .map((m) => m.description) as string[];
    },
    cliShort: "m",
  };

  private static keys = {
    name: "Keys",
    options: () => commonKeys,
    cliShort: "k",
  };

  private static progression = {
    name: "Progression",
    isCli: true,
    options: (prev: TOptionsReturnType<IQuizOptions[]> | undefined) => {

      if (!prev) {
        LogError(`Conditional options depends on previous options at ${this.progression.name}`);
      }

      const mp = prev.filter((p) => p.name === this.melodicPatterns.name).first_and_only().options;
      const prevPs = prev.filter((p) => p.name === this.progressions.name).first_and_only().options;

      const melodicPatternsChosen = melodicPatterns
        .filter(m => mp.includes(m.description))
        .map(m => m.globalConditions.id)

      return progressions
        .filter(p => prevPs.includes(p.description))
        .map((p) => p.progressions)
        .flat()
        .filter(p  => !p.voiceLeading ? true :  p.voiceLeading.some(v => melodicPatternsChosen.includes(v)))
        .map((p) => p.description);
    },
    cliShort: "p",
  };

  static get options() {
    return [this.progressions, this.melodicPatterns, this.keys, this.progression] as const;
  }
}

type TOptionsType = typeof Options.options;

export interface TChord {
  symbol: string;
  aliases: string[];
  tonic: string;
  intervals: TIntervalInteger[];
  notes: TNoteAllAccidental[];
  quality: "Major" | "Minor" | "Augmented" | "Diminished" | "Unknown";
  type?: string;
}

export interface TChordRomanNumeral extends TChord {
  romanNumeral: string;
}

const melodicPatterns: IMelodyGeneratorBase[] = [
  MelodyTopSingulate,
  MelodyChordal,
  MelodyPattern_001,
  MelodyPattern_002,
  MelodyPattern_003
];

export const AudiateHarmony: IQuiz<TOptionsType> = class extends AudiateQuizBase<TOptionsReturnType<TOptionsType>> {
  verify_options(_: TOptionsReturnType<TOptionsType>): boolean {
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
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);

    const [optionsProgressions, optiosMelodicPatterns, optionsKeys, optionsProgression] = options;
    // TODO : deconstruct similarly in all classes

    this.key = optionsKeys.options.random_item();
    
    const randomProgression = progressions
    .filter((p) => optionsProgressions.options.includes(p.description))
    .map((p) => p.progressions)
    .flat()
    .filter((p) => optionsProgression.options.includes(p.description))
    .random_item();

    
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    const keyType = get_key(this.key, this.progressionIsMajor ? "major" : "minor");
    this.keyInfo = keyinfo(keyType);
    
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNueralDict.notes(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transpose_progression(randomProgressionInC, this.key);

    try {
      this.chords = progression_to_chords(this.randomProgressionInKey, this.keyInfo, randomProgression.scale);
    } catch (error) {
      const errorMessage = `${error} ${this.progressionDescription} `;
      LogError(`${(error as Error).message}\n${errorMessage}`);
    }

    const melodicPattern = melodicPatterns
      .filter((p) => {
        return !randomProgression.voiceLeading ? true : randomProgression.voiceLeading.includes(p.globalConditions.id)
      })
      .filter((pattern) => optiosMelodicPatterns.options.includes(pattern.description))
      .random_item();

    try {
      this.melody = melodyGenerator(
        this.randomProgressionInKey,
        melodicPattern,
        this.chords,
        this.keyInfo,
        randomProgression.scale
      );
    } catch (error) {
      LogError(
        `${error} progression description : ${this.progressionDescription} melodic pattern: ${melodicPattern.id}`
      );
    }
  }

  protected override initTempo: number = 200;

  get quiz_head() {
    const description = this.progressionDescription ? `${chalk.underline(this.progressionDescription)}` : "";

    const identifiers = this.progressionTags ? `Identifiers : ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [
      `${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(
        this.key + " " + (this.progressionIsMajor ? "Major" : "Minor")
      )} (${description}) ${identifiers}`,
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
    ] as const;
  }

  get table_header() {
    return this.chords
      .map((chord) => `${chord.romanNumeral} (${chord.symbol})`)
      .map((c): ITableHeader => {
        return { name: c, duration: this.melody.timeSignature };
      });
  }

  static meta() {
    return {
      get all_options() {
        return Options.options;
      },
      name: "Audiate harmonic progressions",
      description: "Audiate the harmonic progression as solfege degrees",
      instructions: [
        "Audiate various lines using the notes that make the harmony.",
        "Audiate with or without accompaniment.",
        "Also try to include non chord tones, passing tones, suspensions, escape tones, neighbouring tones, appogiatura and anticipation",
      ],
    };
  }
};
