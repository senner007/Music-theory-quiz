import chalk from "chalk";
import { IQuiz } from "./quiztypes/quiz-types";
import {
  random_note_single_accidental,
  number_to_degree,
  variant_to_base,
  random_index
} from "../utils";
import { TextQuizBase } from "./quizBase/textBase";
import { allScaleNamesSorted, create_scale, scale_note_at_index, note_variants } from "../tonal-interface";

type TOptionType = [{ name : string, options : readonly string[] }]

export const NameScaleDegree: IQuiz<TOptionType> = class extends TextQuizBase<TOptionType> {
  verify_options(options: TOptionType): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleNamesSorted.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<TOptionType>) {
    super(options);
    this.scale = create_scale(random_note_single_accidental(), options[0].options.random_item());
    const randomIndex = random_index(this.scale.notes);
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
  answer(): string {
    return this.randomNote;
  }

  static meta() {
    return {
      get all_options() {
        return [{ name : "Scale types", options: [
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
      },
      name: "Name the scale degree note",
      description: "Choose the correct note name for the scale degree",
    };
  }
};
