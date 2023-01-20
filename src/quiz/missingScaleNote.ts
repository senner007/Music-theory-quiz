import {
  note_variants,
  random_note_single_accidental,
  allScaleTypes,
  create_scale,
  variant_to_base,
  scale_notes,
} from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { TextQuizBase } from "./quizBase/textBase";

export const MissingScaleNote: Quiz<string[]> = class extends TextQuizBase<string[]> {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  scale;
  scaleStringMissingNote;
  randomNote;
  randomNoteVariants;
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);

    this.scale = create_scale(random_note_single_accidental(), scaleTypes.randomItem());
    this.randomNote = scale_notes(this.scale).randomItem();

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
        return [
          "major",
          "aeolian",
          "major pentatonic",
          "dorian",
          "phrygian",
          "lydian",
          "mixolydian",
          "locrian",
          "harmonic minor",
          "melodic minor",
        ];
      },
      name: "Name the missing scale note",
      description: "Choose the correct name for the missing scale note",
    };
  }
};
