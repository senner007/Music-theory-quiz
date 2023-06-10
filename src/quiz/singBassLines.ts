import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { INotePlay } from "../midiplay";
import { IQuizInstance, IQuiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import {
  TNoteSingleAccidental,
  to_octave,
  note_transpose,
  random_note_single_accidental,
  get_interval_distance,
} from "../utils";
import { SingingQuizBase } from "./quizBase/singingQuizBase";

type optionType = [{ name : string, options : TProgression["description"][]}]

export const SingBassLines: IQuiz<optionType> = class extends SingingQuizBase<optionType> {
  verifyOptions(_: optionType): boolean {
    return true;
  }

  randomNote: TNoteSingleAccidental;
  override tempo = 1000;

  randomBassLineInKey;
  progressionDescription
  progressionIsDiatonic;
  progressionIsMajor;
  constructor(options: Readonly<optionType>) {
    super(options);
    this.randomNote = random_note_single_accidental();
    const selectProgressions = progressions.filter(p => options.firstAndOnly().options.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().randomItem();

    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    this.progressionDescription = randomProgression.description;

    const keyDistance = get_interval_distance("C", this.randomNote)
    this.randomBassLineInKey = randomProgression.bass.transposeBy(keyDistance);
  }

  get quizHead() {
    const description = this.progressionDescription;
    const diatonic =  this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
    const key = chalk.underline(this.randomNote + " " + (this.progressionIsMajor ? "Major" : "Minor"))
    return [
      `Description: ${description}\n${diatonic} progression bass line in key of ${key}`,
    ];
  }

  get question() {
    return "";
  }

  getAudio() {
    const bassLine = this.randomBassLineInKey.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
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
      { audio: bassLine, keyboardKey: "space", message: "play bass line", display: true } as const,
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ];
  }

  get tableHeader() {
    return this.randomBassLineInKey.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 };
    });
  }

  static meta() {
    return {
      get getAllOptions() {
        return [{ name : "Bass lines", options : progressions.map(p => p.description) as TProgression["description"][] }] as const
      },
      name: "Sing bass lines",
      description: "Sing the harmonic progression bass line as solfege degrees",
    };
  }
};
