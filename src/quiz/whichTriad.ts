import { random_note_single_accidental, allChordTypes, create_chord } from "../utils";
import { Quiz } from "../quiz-types";
import chalk from "chalk";
import { TextQuizBase } from "./quizBase/textBase";

type optionType = [{ name : string, options : readonly string[] }]

export const WhichTriad: Quiz<optionType> = class extends TextQuizBase<optionType> {
  verifyOptions(options: optionType): boolean {
    return options.firstAndOnly().options.every((chordType) => allChordTypes.includes(chordType));
  }

  randomChord;
  chordTypesAndNotes;
  constructor(options: Readonly<optionType>) {
    super(options);
    const chordOptions = options.firstAndOnly().options.map((chordType) => create_chord(random_note_single_accidental(), chordType));
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
        return [{ name : "Chord types", options : ["major", "minor", "augmented", "diminished"] }] as const;
      },
      name: "Which triad",
      description: "Choose the notes that make up the triad",
    };
  }
};
