import chalk from "chalk";
import { romanNumeralChord, progressions, Progression } from "../harmonicProgressions";
import { keyInfo, getNumeralBySymbol } from "../keyInfo";
import { INotePlay } from "../midiplay";
import { Quiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import { transposeProgression } from "../transposition";
import { noteSingleAccidental, toOctave, note_transpose, random_note_single_accidental, getKey } from "../utils";
import { SingingQuizBase } from "./quizBase/singingQuizBase";
import { MelodyPattern_001, MelodySingulate, melodyPattern} from "../melodyGenerator";

type optionType = [
  { name : string, options : Progression["description"][]},
  { name : string, options : string[]}
]

const melodicPatterns = [
  MelodySingulate, MelodyPattern_001
]

export const SingHarmony: Quiz<optionType> = class extends SingingQuizBase<optionType> {
  verifyOptions(_: optionType): boolean {
    return true;
  }

  randomNote: noteSingleAccidental;
  override tempo = 200;
  chords;
  randomProgressionInKey;
  melody;
  progressionTags;
  progressionDescription;
  progressionIsDiatonic;
  progressionIsMajor;
  keyInfo;
  constructor(options: Readonly<optionType>) {
    super(options);
    this.randomNote = random_note_single_accidental();
    const selectProgressions = progressions.filter(p => options[0].options.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().randomItem();
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    const keyType = getKey(this.randomNote, this.progressionIsMajor ? "major" : "minor")
    this.keyInfo = keyInfo(keyType);
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transposeProgression(randomProgressionInC, this.randomNote);

    this.chords = this.randomProgressionInKey.chords.map((n, index: number) => {
      return getNumeralBySymbol(this.keyInfo, [this.randomProgressionInKey.bass[index], ...n])
    });

    const randomMelodyPatternDescription =  options[1].options.randomItem();
    this.melody = melodyPattern(this.randomProgressionInKey, melodicPatterns.filter(pattern => pattern.description === randomMelodyPatternDescription).firstAndOnly());

  }

  get quizHead() {
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

  getAudio() {
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
          toOctave(this.randomNote, "2"),
          toOctave(this.randomNote, "3"),
          toOctave(note_transpose(this.randomNote, this.progressionIsMajor ? "3M" : "3m"), "3"),
          toOctave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", message: "play progression", display: true } as const,
      { audio: [audioBass], keyboardKey: "b", message: "play bass line" },
      { audio: [audio, audioBass], keyboardKey: "m", message: "play progression with bass line" },
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ]
  }

  get tableHeader() {
    return this.chords.map((c): ITableHeader => {
      return { name: c, duration: this.melody.timeSignature };
    });
  }

  static meta() {
    return {
      get getAllOptions() {
        return [
          { name : "Progressions", options : progressions.map(p => p.description) as Progression["description"][] },
          { name : "Melodic Patterns", options : melodicPatterns.map(m =>  m.description) as string[] },
        
        ] as const
      },
      name: "Sing harmonic progressions",
      description: "Sing the harmonic progression as solfege degrees",
      instructions: [
        "Sing various lines using the notes that make the harmony.", 
        "Sing with or without accompaniment.",
        "Slso try to include non chord tones, passing tones, suspensions, escape tones, neighbouring tones, appogiatura and anticipation"
      ]
    };
  }
};
