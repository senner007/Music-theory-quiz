import chalk from "chalk";
import { INotePlay } from "../midiplay";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import { ITableHeader } from "../solfege";
import {
  TNoteSingleAccidental,
  random_note_single_accidental,
  TIntervalAbsolute,
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { create_scale, scale_notes, interval_distance, interval_to_absolute, add_octave_above } from "../tonal-interface";

const scales = [
  "major",
  "minor",
  "major pentatonic",
  "dorian",
  // "phrygian",
  "lydian",
  "mixolydian",
  // "locrian",
  "harmonic minor",
  "melodic minor",
] as const;
const intervals: TIntervalAbsolute[] = ["2m", "2M", "3m", "3M", "4P", "4A", "5d", "5P", "6m", "6M"] as const;

const options =  [
  { name : "Scales", options : () => scales, cliShort : "s" }, 
  { name : "Intervals", options:() =>  intervals, cliShort : "i" }
] as const;

type TOptionsType = typeof options;

export const AudiateContextualIntervals: IQuiz<TOptionsType> = class extends AudiateQuizBase<
TOptionsReturnType<TOptionsType>
> {

  verify_options(_: TOptionsReturnType<TOptionsType>): boolean {
    return true;
  }

  key: TNoteSingleAccidental;
  randomScaleType;
  interval;
  scaleThirdOctave;
  timeSignature = 1 as const;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);
    const [scaletypes, intervals] = options;
    
    this.key = random_note_single_accidental();
    this.randomScaleType = scaletypes.options.random_item();
    const randomScale = create_scale(this.key, this.randomScaleType);

    this.scaleThirdOctave = scale_notes(randomScale).to_octave_ascending("3")
    const randomScaleNotes = [
      ...this.scaleThirdOctave,
      ...scale_notes(randomScale).to_octave_ascending("4")
    ];

    const firstNote = randomScaleNotes.random_item();

    const secondTonePossibilities = randomScaleNotes
      .filter((n) => !(n === firstNote))
      .filter((n) => {
        const intervalDistance = interval_distance(n, firstNote)
        return intervals.options.includes(interval_to_absolute(intervalDistance));
      });

    const secondNote = secondTonePossibilities.random_item();
    this.interval = [firstNote, secondNote] as const;
  }

  get quiz_head() {
    return [
      `Identify and sing the interval from the ${chalk.underline(this.randomScaleType)} scale`
    ];
  }

  get question() {
    return "";
  }

  audio() {
    const interval = this.interval.map((n) => {
      return { noteNames: [n], duration: 2 } as const;
    });

    const [firstNote, secondNote] = interval;

    const root = [{ noteNames: [this.scaleThirdOctave.first_or_throw()], duration: 1 } as const];

    const scale = add_octave_above(this.scaleThirdOctave)
      .map(n  => {
        return { noteNames: [n], duration: 1 } as const;
      });

    return [
      { audio: interval, keyboardKey: "space", message: "play interval", display: true, solo : true },
      { audio: [firstNote], keyboardKey: "a", onInit: true, message: "play the fist note", solo : true },
      { audio: [secondNote], keyboardKey: "s", message: "play the second note", solo : true },
      { audio: root, keyboardKey: "d", message: "play the root of the scale", solo : true },
      { audio: scale, keyboardKey: "f", message: "play the scale", solo : true },
    ] as const;
  }

  get table_header() {
    return this.interval.map((_, index) => {
      index++;
      return { name: index.toString().padStart(2, "0"), duration: 2 } as const;
    });
  }

  protected override initTempo : number = 300;

  static meta() {
    return {
      get all_options() {
        return options;
      },
      name: "Audiate contextual intervals",
      description: "Audiate the contextual interval",
    };
  }
};
