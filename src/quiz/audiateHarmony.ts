import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { key_info, numeral_by_symbol } from "../keyInfo";
import { INotePlay } from "../midiplay";
import { IQuiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import { transpose_progression } from "../transposition";
import { TNoteSingleAccidental, to_octave, note_transpose, random_note_single_accidental, get_key } from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { melodyGenerator } from "../melodyGenerator/melodyGenerator";
import {  MelodyPattern_001, MelodyPattern_002, MelodyPattern_003, MelodyPattern_004, MelodyPattern_005, MelodyPattern_006, MelodySingulate } from "../melodyGenerator/melodyPatterns";
import { romanNumeralChord } from "../harmony/romanNumerals";

type TOptionType = [
  { name : string, options : TProgression["description"][]},
  { name : string, options : string[]}
]

const melodicPatterns = [
  MelodySingulate, 
  MelodyPattern_001, 
  MelodyPattern_002, 
  MelodyPattern_003, 
  MelodyPattern_004,
  MelodyPattern_005,
  MelodyPattern_006,

]

export const SingHarmony: IQuiz<TOptionType> = class extends AudiateQuizBase<TOptionType> {
  verify_options(_: TOptionType): boolean {
    return true;
  }

  randomNote: TNoteSingleAccidental;
  override tempo = 200;
  chords;
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
    this.randomNote = random_note_single_accidental();
    const selectProgressions = progressions.filter(p => options[0].options.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().random_item();
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    const keyType = get_key(this.randomNote, this.progressionIsMajor ? "major" : "minor")
    this.keyInfo = key_info(keyType);
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transpose_progression(randomProgressionInC, this.randomNote);

    this.chords = this.randomProgressionInKey.chords.map((n, index: number) => {
      return numeral_by_symbol(this.keyInfo, [this.randomProgressionInKey.bass[index], ...n])
    });

    const randomMelodyPatternDescription =  options[1].options.random_item();
    const melodicPattern = melodicPatterns.filter(pattern => pattern.description === randomMelodyPatternDescription).first_and_only()
    this.melody = melodyGenerator(
      this.randomProgressionInKey, 
      melodicPattern,
      this.keyInfo
      );

  }

  get quiz_head() {
    const description = this.progressionDescription
      ? `Description: ${chalk.underline(this.progressionDescription)}`
      : "";

    const chords = `${this.chords.join(", ")}`;
    const identifiers = this.progressionTags ? `Identifiers: ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [
      `${description} ${identifiers}`,
      `${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(
        this.randomNote + " " + (this.progressionIsMajor ? "Major" : "Minor")
      )}`,
      chords,
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
          to_octave(this.randomNote, "2"),
          to_octave(this.randomNote, "3"),
          to_octave(note_transpose(this.randomNote, this.progressionIsMajor ? "3M" : "3m"), "3"),
          to_octave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "m", message: "play melody", display: true } as const,
      { audio: [audioBass], keyboardKey: "b", message: "play bass line" },
      { audio: [audio, audioBass], keyboardKey: "space", message: "play melody with bass line" },
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ]
  }

  get table_header() {
    return this.chords.map((c): ITableHeader => {
      return { name: c, duration: this.melody.timeSignature };
    });
  }

  static meta() {
    return {
      get all_options() {
        return [
          { name : "Progressions", options : progressions.map(p => p.description) as TProgression["description"][] },
          { name : "Melodic Patterns", options : melodicPatterns.map(m =>  m.description) as string[] },
        
        ] as const
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
