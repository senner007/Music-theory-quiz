import { random_note_single_accidental, allChordTypes, create_chord } from "../utils";
import { Quiz } from "../quiz-types";
import chalk from "chalk";
import { TextQuizBase } from "./quizBase/textBase";

export const WhichTriad: Quiz<string[]> = class extends TextQuizBase<string[]> {
  verifyOptions(chordTypes: string[]): boolean {
    return chordTypes.every((chordType) => allChordTypes.includes(chordType));
  }

  randomChord;
  chordPossibilities = ["major", "minor", "diminished", "augmented"];
  chordTypesAndNotes;
  constructor(chordTypes: Readonly<string[]>) {
    super(chordTypes);
    const chordOptions = this.chordPossibilities.map((chordType) => create_chord(random_note_single_accidental(), chordType));
    this.chordTypesAndNotes = chordOptions
      .map((chord) => {
        return { chord: chord, notes: chord.notes.shuffleArray().commaSequence() };
      })
      .shuffleArray();

    this.randomChord = this.chordTypesAndNotes.randomItem();
  }

  get quizHead() {
    return [`Select the ${chalk.underline(this.randomChord.chord.type.toUpperCase())} chord in ${chalk.underline('any inversion')}`];
  }
  get questionOptions() {
    return this.chordTypesAndNotes.map((chordTypesAndNotes) => chordTypesAndNotes.notes);
  }
  get question() {
    return `What notes spell the triad?`;
  }
  answer(): string {
    return this.randomChord.notes;
  }

  static meta() {
    return {
      get getAllOptions() {
        return ["major", "minor", "augmented", "diminished"];
      },
      name: "Which triad",
      description: "Choose the notes that make up the triad",
    };
  }
};
