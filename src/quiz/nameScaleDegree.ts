import chalk from "chalk";
import { IQuizInstance, IQuiz } from "../quiz-types";
import {
  allScaleTypes,
  random_note_single_accidental,
  number_to_degree,
  note_variants,
  create_scale,
  variant_to_base,
  scale_note_at_index,
  random_index
} from "../utils";
import { TextQuizBase } from "./quizBase/textBase";

type optionType = [{ name : string, options : readonly string[] }]

export const NameScaleDegree: IQuiz<optionType> = class extends TextQuizBase<optionType> {
  verify_options(options: optionType): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  randomDegree;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<optionType>) {
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
