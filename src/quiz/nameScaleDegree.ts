import chalk from "chalk";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import {
  random_note_single_accidental,
  number_to_degree,
  variant_to_base,
  random_index,
  random_index_range
} from "../utils";
import { TextQuizBase } from "./quizBase/textBase";
import { allScaleNamesSorted, create_scale, scale_note_at_index, note_variants } from "../tonal-interface";

export const nameScaleDegreeOptions = [{ name : "Scale types", cliShort : "s", options: () => [
  "major",
  "minor",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "locrian",
  "harmonic minor",
  "melodic minor",
]
}] as const;

type TOptionsType = typeof nameScaleDegreeOptions

export const NameScaleDegree: IQuiz<TOptionsType> = class extends TextQuizBase<TOptionsReturnType<TOptionsType>> {

  verify_options(options: TOptionsReturnType<TOptionsType>): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleNamesSorted.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);
    const [scaleTypeOptions] = options;

    this.scale = create_scale(random_note_single_accidental(), scaleTypeOptions.options.random_item());
    const randomIndex = random_index_range(1, this.scale.notes);
    this.randomNote = scale_note_at_index(this.scale, randomIndex);
    this.randomDegree = number_to_degree(randomIndex);
    this.randomNoteVariants = note_variants(variant_to_base(this.randomNote));
  }
  get quiz_head() {
    const degreeName = `${this.randomDegree} degree`;
    return [`The ${chalk.underline(degreeName)} in ${this.scale.name}`];
  }
  get question_options() {
    return this.randomNoteVariants;
  }
  get question() {
    return `Which is the degree?`;
  }
  answer() {
    return this.randomNote;
  }

  static meta() {
    return {
      get all_options() {
        return nameScaleDegreeOptions;
      },
      name: "Name the scale degree note",
      description: "Choose the correct note name for the scale degree",
    };
  }
};
