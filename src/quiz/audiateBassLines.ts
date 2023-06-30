import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { INotePlay } from "../midiplay";
import { IQuizInstance, IQuiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import {
  TNoteSingleAccidental,
  to_octave,
  random_note_single_accidental,
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { get_interval_distance, note_transpose } from "../tonal-interface";

type TOptionType = [{ name : string, options : TProgression["description"][]}]

export const AudiateBassLines: IQuiz<TOptionType> = class extends AudiateQuizBase<TOptionType> {
  verify_options(_: TOptionType): boolean {
    return true;
  }

  key: TNoteSingleAccidental;

  randomBassLineInKey;
  progressionDescription
  progressionIsDiatonic;
  progressionIsMajor;
  timeSignature = 4 as const;
  constructor(options: Readonly<TOptionType>) {
    super(options);
    this.key = random_note_single_accidental();
    const selectProgressions = progressions.filter(p => options.first_and_only().options.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().random_item();

    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    this.progressionDescription = randomProgression.description;

    const keyDistance = get_interval_distance("C", this.key)
    this.randomBassLineInKey = randomProgression.bass.transpose_by(keyDistance);
  }

  get quiz_head() {
    const description = this.progressionDescription;
    const diatonic =  this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
    const key = chalk.underline(this.key + " " + (this.progressionIsMajor ? "Major" : "Minor"))
    return [
      `Description: ${description}\n${diatonic} progression bass line in key of ${key}`
    ];
  }

  get question() {
    return "";
  }

  audio() {
    const bassLine = this.randomBassLineInKey.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          to_octave(this.key, "2"),
          to_octave(this.key, "3"),
          to_octave(note_transpose(this.key, this.progressionIsMajor ? "3M" : "3m"), "3"),
          to_octave(note_transpose(this.key, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: bassLine, keyboardKey: "space", message: "play bass line", display: true } as const,
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ];
  }

  get table_header() {
    return this.randomBassLineInKey.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 };
    });
  }

  protected override initTempo : number = 500;

  static meta() {
    return {
      get all_options() {
        return [{ name : "Bass lines", options : progressions.map(p => p.description) as TProgression["description"][] }] as const
      },
      name: "Audiate bass lines",
      description: "Audiate the harmonic progression bass line as solfege degrees",
    };
  }
};
