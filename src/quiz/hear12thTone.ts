import { base_notes, chromatic_scale_notes,create_scale, get_interval_distance, TOctave } from "../utils";
import { IQuizInstance, IQuiz } from "../quiz-types";
import chalk from "chalk";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

export const Hear12thTone: IQuiz<never []> = class extends ListeningQuizBase<never []> {
  verifyOptions(): boolean {
    return true;
  }

  randomNote;
  startingNote;
  chromaticScaleShuffled;
  missingNote;
  octave : TOctave = "4";
  constructor(options: Readonly<never[]>) {
    super(options);
    this.randomNote = base_notes().random_item();
    const chromaticScale = create_scale(this.randomNote, "chromatic");
    this.chromaticScaleShuffled = chromatic_scale_notes(chromaticScale).shuffle_array();
    this.missingNote = this.chromaticScaleShuffled.slice(1, this.chromaticScaleShuffled.length).random_item();
    this.startingNote = this.chromaticScaleShuffled[0];
  }

  get quizHead() {
    return ["Starting note is: " + this.startingNote];
  }
  get questionOptions() {
    return this.chromaticScaleShuffled.slice(1, this.chromaticScaleShuffled.length);
  }
  get question() {
    return `What note is ${chalk.underline("not")} heard?`;
  }
  answer(): string {
    return this.missingNote;
  }

  override feedbackWrong(): string {
    const chromaticScaleShuffledInOctave = this.chromaticScaleShuffled
    .filter(note => note !== this.missingNote)
    .to_octave_ascending(this.octave);
    
    const notesWithIntervalsRows = chromaticScaleShuffledInOctave
        .map((note, index) => {
            if (index === 0) return `${note}\n`;
            const interval = get_interval_distance(chromaticScaleShuffledInOctave[index - 1], note);
            return `${note}, ${interval}\n`;
        }).join("")
    const answer = `Note: ${chalk.green(this.missingNote)}\nThe intervals are:\n${notesWithIntervalsRows}`

    return super.feedbackWrong() + answer;
  }

  audio() {

    const audio = this.chromaticScaleShuffled
        .filter(note => note !== this.missingNote)
        .to_octave_ascending(this.octave)
        .map(note => { return { noteNames: [note], duration: 1 } as INotePlay });

        return [ { audio : [audio], keyboardKey : "space", onInit : true, message : "play row"} ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [];
      },
      name: "Hear the missing 12th tone",
      description: "Listen to the 12-tone row with one note missing. Identify the missing note.",
    };
  }
};
