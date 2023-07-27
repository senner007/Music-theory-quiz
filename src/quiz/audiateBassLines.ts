import chalk from "chalk";
import { progressions, TProgression } from "../harmony/harmonicProgressions";
import { IQuiz, TOptionsReturnType } from "./quiztypes/quiz-types";
import {
  to_octave,
  commonKeys,
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { interval_distance, note_transpose } from "../tonal-interface";

export const bassLineOptions = [
  { name : "Bass lines", options : () => progressions.map(p => p.description) as TProgression["description"][], cliShort : "b" },
  { name : "Keys",  options: () => commonKeys, cliShort : "b" }
] as const

type TOptionsType = typeof bassLineOptions

export const AudiateBassLines: IQuiz<TOptionsType> = class extends AudiateQuizBase<TOptionsReturnType<TOptionsType>> {
  verify_options(_: TOptionsReturnType<TOptionsType>): boolean {
    return true;
  }

  key;
  randomBassLineInKey;
  progressionDescription
  progressionIsDiatonic;
  progressionIsMajor;
  timeSignature = 4 as const;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);

    const [bassLinesOptions, optionsKeys] = options;

    this.key = optionsKeys.options.random_item();
    const selectProgressions = progressions.filter(p => bassLinesOptions.options.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().random_item();

    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    this.progressionDescription = randomProgression.description;

    const keyDistance = interval_distance("C", this.key)
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
    const bassLine = this.randomBassLineInKey.map(n => {
      return { noteNames: [n], duration: 1 } as const;
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
      { audio: bassLine, keyboardKey: "space", message: "play bass line", display: true, solo: true },
      { audio: keyAudio, keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key", solo: true },
    ] as const;
  }

  get table_header() {
    return this.randomBassLineInKey.map((_, index) => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 } as const;
    });
  }

  protected override initTempo : number = 500;

  static meta() {
    return {
      get all_options() {
        return bassLineOptions
      },
      name: "Audiate bass lines",
      description: "Audiate the harmonic progression bass line as solfege degrees",
    };
  }
};
