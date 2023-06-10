import {
  note_variants,
  random_note_single_accidental,
  allScaleTypes,
  create_scale,
  variant_to_base,
  scale_notes,
} from "../utils";
import { IQuizInstance, IQuiz } from "../quiz-types";
import { TextQuizBase } from "./quizBase/textBase";

type optionType = [{ name : string, options : readonly string[] }]

export const MissingScaleNote: IQuiz<optionType> = class extends TextQuizBase<optionType> {
  verifyOptions(options: optionType): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  scaleStringMissingNote;
  randomNote;
  randomNoteVariants;
  constructor(options: Readonly<optionType>) {
    super(options);

    this.scale = create_scale(random_note_single_accidental(), options[0].options.random_item());
    this.randomNote = scale_notes(this.scale).random_item();

    this.scaleStringMissingNote = this.scale.notes
      .map((n) => (n === this.randomNote ? "- MISSING -" : n))
      .reduce((acc, cur) => acc + cur + " ", "");

    this.randomNoteVariants = note_variants(variant_to_base(this.randomNote));
  }

  get quizHead() {
    return [this.scale.name, this.scaleStringMissingNote];
  }
  get questionOptions() {
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
      get getAllOptions() {
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
