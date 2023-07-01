import {
  random_note_single_accidental,
  variant_to_base,
} from "../utils";
import { IQuizInstance, IQuiz } from "./quiztypes/quiz-types";
import { TextQuizBase } from "./quizBase/textBase";
import { allScaleNamesSorted, create_scale, scale_notes, note_variants } from "../tonal-interface";

type TOptionType = [{ name : string, options : readonly string[] }]

export const MissingScaleNote: IQuiz<TOptionType> = class extends TextQuizBase<TOptionType> {
  verify_options(options: TOptionType): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleNamesSorted.includes(scaleType));
  }

  scale;
  scaleStringMissingNote;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<TOptionType>) {
    super(options);

    this.scale = create_scale(random_note_single_accidental(), options.first().options.random_item());
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
      name: "Name the missing scale note",
      description: "Choose the correct name for the missing scale note",
    };
  }
};
