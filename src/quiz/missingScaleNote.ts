import {
  random_note_single_accidental,
  variant_to_base,
} from "../utils";
import { IQuizInstance, IQuiz, TOptionsReturnType, IQuizOptions } from "./quiztypes/quiz-types";
import { TextQuizBase } from "./quizBase/textBase";
import { allScaleNamesSorted, create_scale, scale_notes, note_variants } from "../tonal-interface";

const options = [{ name : "Scale types", cliShort : "s", options: () => [
  "major",
  "aeolian",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "locrian",
  "harmonic minor",
  "melodic minor",
]
}] as const;

type TOptionsType = typeof options;

export const MissingScaleNote: IQuiz<TOptionsType> = class extends TextQuizBase<TOptionsReturnType<TOptionsType>> {

  verify_options(options: TOptionsReturnType<TOptionsType>): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleNamesSorted.includes(scaleType));
  }

  scale;
  scaleStringMissingNote;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);
    const [scaleTypeOptions] = options

    this.scale = create_scale(random_note_single_accidental(), scaleTypeOptions.options.random_item());
    this.randomNote = scale_notes(this.scale).random_item();

    this.scaleStringMissingNote = this.scale.notes
      .map((n) => (n === this.randomNote ? "- MISSING -" : n))
      .reduce((acc, cur) => acc + cur + " ", "");

    this.randomNoteVariants = note_variants(variant_to_base(this.randomNote));
  }

  get quiz_head() {
    return [this.scale.name, this.scaleStringMissingNote];
  }
  get question_options() {
    return this.randomNoteVariants;
  }
  get question() {
    return "Which note is missing?";
  }
  answer(): string {
    return this.randomNote;
  }

  static meta() {
    return {
      get all_options() {
        return options;
      },
      name: "Name the missing scale note",
      description: "Choose the correct name for the missing scale note",
    };
  }
};
