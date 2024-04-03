import chalk from "chalk";
import { IQuiz, TOptionsReturnType } from "./quiztypes/quiz-types";
import {
  to_octave,
  commonKeys,
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { interval_distance, note_transpose } from "../tonal-interface";
import { TCounterpoint, counterpointExamples } from "../counterpoint";

export const bassLineOptions = [
  { name : "Counterpoint", options : () => counterpointExamples.map(p => p.description) as TCounterpoint["description"][], cliShort : "c" },
  { name : "Keys",  options: () => commonKeys, cliShort : "k" }
] as const

type TOptionsType = typeof bassLineOptions

export const AudiateCounterpoint: IQuiz<TOptionsType> = class extends AudiateQuizBase<TOptionsReturnType<TOptionsType>> {
  verify_options(_: TOptionsReturnType<TOptionsType>): boolean {
    return true;
  }

  randomKey;
  randomExampleCantusInKey;
  randomExampleCounterpointInKey;
  counterpointDescription
  counterpointIsDiatonic;
  counterpointIsMajor;
  timeSignature = 4 as const;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);

    const [bassLinesOptions, optionsKeys] = options;

    this.randomKey = optionsKeys.options.random_item();
    const selectProgressions = counterpointExamples.filter(p => bassLinesOptions.options.some(description => description === p.description));
    const randomExample = selectProgressions.map(p => p.examples).flat().random_item();

    this.counterpointIsDiatonic = randomExample.isDiatonic;
    this.counterpointIsMajor = randomExample.isMajor;
    this.counterpointDescription = randomExample.description;

    const keyDistance = interval_distance("C", this.randomKey)
    this.randomExampleCantusInKey = randomExample.cantus.transpose_by(keyDistance);
    this.randomExampleCounterpointInKey = randomExample.counterpoint.transpose_by(keyDistance);
  }

  get quiz_head() {
    const description = this.counterpointDescription;
    const diatonic =  this.counterpointIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
    const key = chalk.underline(this.randomKey + " " + (this.counterpointIsMajor ? "Major" : "Minor"))
    return [
      `Description: ${description}\n${diatonic} counterpoint line in key of ${key}`
    ];
  }

  get question() {
    return "";
  }

  audio() {
    const bassLine = this.randomCounterpointInKey.map(n => {
      return { noteNames: [n], duration: 1 } as const;
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          to_octave(this.randomKey, "2"),
          to_octave(this.randomKey, "3"),
          to_octave(note_transpose(this.randomKey, this.counterpointIsMajor ? "3M" : "3m"), "3"),
          to_octave(note_transpose(this.randomKey, "5P"), "3"),
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
    return this.randomCounterpointInKey.map((_, index) => {
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
