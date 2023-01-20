import { base_notes, chromatic_scale_notes,create_scale, octave } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { Interval} from "@tonaljs/tonal";
import chalk from "chalk";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

export const Hear12thTone: Quiz<undefined[]> = class extends ListeningQuizBase<undefined[]> {
  verifyOptions(): boolean {
    return true;
  }

  randomNote;
  startingNote;
  chromaticScaleShuffled;
  missingNote;
  octave : octave = "4";
  constructor(scaleTypes: Readonly<undefined[]>) {
    super(scaleTypes);
    this.randomNote = base_notes().randomItem();
    const chromaticScale = create_scale(this.randomNote, "chromatic");
    this.chromaticScaleShuffled = chromatic_scale_notes(chromaticScale).shuffleArray();
    this.missingNote = this.chromaticScaleShuffled.slice(1, this.chromaticScaleShuffled.length).randomItem();
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
    .toOctaveAscending(this.octave);
    
    const notesWithIntervalsRows = chromaticScaleShuffledInOctave
        .map((note, index) => {
            if (index === 0) return `${note}\n`;
            const interval = Interval.distance(chromaticScaleShuffledInOctave[index - 1], note);
            return `${note}, ${interval}\n`;
        }).join("")
    const answer = `Note: ${chalk.green(this.missingNote)}\nThe intervals are:\n${notesWithIntervalsRows}`

    return super.feedbackWrong() + answer;
  }

  getAudio() {

    const audio = this.chromaticScaleShuffled
        .filter(note => note !== this.missingNote)
        .toOctaveAscending(this.octave)
        .map(note => { return { noteNames: [note], duration: 1 } as INotePlay });

        return [ { audio : audio, keyboardKey : "space", onInit : true, channel : 1, message : "play row"} ]
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
