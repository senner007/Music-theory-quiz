import { random_note_single_accidental} from "../utils";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import chalk from "chalk";
import { TextQuizBase } from "./quizBase/textBase";
import { allChordNamesSorted, create_chord } from "../tonal-interface";

const options = [{ name : "Chord types", options : () => ["major", "minor", "augmented", "diminished"], cliShort : "c" }] as const;

type TOptionsType = typeof options;

export const WhichTriad: IQuiz<TOptionsType> = class extends TextQuizBase<TOptionsReturnType<TOptionsType>> {

  verify_options(options: TOptionsReturnType<TOptionsType>): boolean {
    return options.first_and_only().options.every((chordType) => allChordNamesSorted.includes(chordType));
  }

  randomChord;
  chordTypesAndNotes;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);
    const chordOptions = options.first_and_only().options.map((chordType) => create_chord(random_note_single_accidental(), chordType));
    this.chordTypesAndNotes = chordOptions
      .map((chord) => {
        return { chord: chord, notes: chord.notes.shuffle_array().comma_sequence() };
      })
      .shuffle_array();

    this.randomChord = this.chordTypesAndNotes.random_item();
  }

  get quiz_head() {
    return [`Select the ${chalk.underline(this.randomChord.chord.type.toUpperCase())} chord in ${chalk.underline('any inversion')}`];
  }
  get question_options() {
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
      get all_options() {
        return options;
      },
      name: "Which triad",
      description: "Choose the notes that make up the triad",
    };
  }
};
