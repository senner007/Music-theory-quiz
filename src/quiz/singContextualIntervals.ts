import chalk from "chalk";
import { INotePlay } from "../midiplay";
import { IQuiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import {
  TNoteSingleAccidental,
  random_note_single_accidental,
  create_scale,
  scale_notes,
  interval_to_absolute,
  TIntervalType,
  get_interval_distance,
  add_octave_note,
} from "../utils";
import { SingingQuizBase } from "./quizBase/singingQuizBase";

type optionsType = [
  { name: string, options: string[] },
  { name: string, options: TIntervalType[] }
]

export const SingContextualIntervals: IQuiz<optionsType> = class extends SingingQuizBase<
  optionsType
> {
  verifyOptions(_: optionsType): boolean {
    return true;
  }

  randomNote: TNoteSingleAccidental;
  randomScaleType;
  interval;
  scaleThirdOctave;
  override tempo = 400;

  constructor(options: Readonly<optionsType>) {
    super(options);
    const [scaletypes, intervals] = options;
    this.randomNote = random_note_single_accidental();
    this.randomScaleType = scaletypes.options.randomItem();
    const randomScale = create_scale(this.randomNote, this.randomScaleType);

    this.scaleThirdOctave = scale_notes(randomScale).toOctaveAscending("3")
    const randomScaleNotes = [
      ...this.scaleThirdOctave,
      ...scale_notes(randomScale).toOctaveAscending("4")
    ];

    const firstNote = randomScaleNotes.randomItem();

    const secondTonePossibilities = randomScaleNotes
      .filter((n) => !(n === firstNote))
      .filter((n) => {
        const intervalDistance = get_interval_distance(n, firstNote)
        return intervals.options.includes(interval_to_absolute(intervalDistance));
      });

    const secondNote = secondTonePossibilities.randomItem();
    this.interval = [firstNote, secondNote];
  }

  get quizHead() {
    return [`Identify and sing the interval from the ${chalk.underline(this.randomScaleType)} scale`];
  }

  get question() {
    return "";
  }

  getAudio() {
    const interval = this.interval.map((n): INotePlay => {
      return { noteNames: [n], duration: 2 };
    });

    const firstNote = [interval[0]];
    const secondNote = [interval[1]];

    const root: INotePlay[] = [{ noteNames: [this.scaleThirdOctave[0]], duration: 1 }];

    const scale = add_octave_note(this.scaleThirdOctave)
      .map((n): INotePlay => {
        return { noteNames: [n], duration: 1 };
      });

    return [
      { audio: interval, keyboardKey: "space", message: "play interval", display: true } as const,
      { audio: [firstNote], keyboardKey: "a", onInit: true, message: "play the fist note" },
      { audio: [secondNote], keyboardKey: "s", message: "play the second note" },
      { audio: [root], keyboardKey: "d", message: "play the root of the scale" },
      { audio: [scale], keyboardKey: "f", message: "play the scale" },

    ];
  }

  get tableHeader() {
    return this.interval.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, "0"), duration: 2 };
    });
  }

  static meta() {
    return {
      get getAllOptions(): optionsType {
        const scales = [
          "major",
          "aeolian",
          "major pentatonic",
          "dorian",
          // "phrygian",
          "lydian",
          "mixolydian",
          // "locrian",
          "harmonic minor",
          "melodic minor",
        ];
        const intervals: TIntervalType[] = ["2m", "2M", "3m", "3M", "4P", "4A", "5d", "5P", "6m", "6M"];
        return [
          { name : "scales", options : scales }, 
          { name : "intervals", options: intervals }
        ];
      },
      name: "Sing contextual intervals",
      description: "Sing the contextual interval",
    };
  }
};
