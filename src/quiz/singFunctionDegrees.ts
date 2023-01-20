import { Interval } from "@tonaljs/tonal";
import { IntervalDistance } from "../harmonicProgressions";
import { INotePlay } from "../midiplay";
import { IQuiz, Quiz } from "../quiz-types";
import { ITableHeader, Syllable, syllables_in_key_of_c } from "../solfege";
import {
  isTooHigh,
  isTooLow, 
  noteAllAccidentalOctave,
  noteSingleAccidental,
  octave,
  random_note_single_accidental,
  toOctave,
  note_transpose,
  ObjectKeys,
  noteAllAccidental
} from "../utils";
import { SingingQuizBase } from "./quizBase/SingingQuizBase";

export const SingingFunctionalDegrees: Quiz<Syllable[]> = class extends SingingQuizBase<Syllable[]> {
  verifyOptions(syllables: Syllable[]): boolean {
    return syllables.every((syllable) => Object.values(syllables_in_key_of_c).includes(syllable));
  }

  randomNote: noteSingleAccidental;
  octaves: octave[] = ["3", "4"]; // in options
  audio;
  stepnumber: number = 12; // in options
  override tempo = 1000;
  constructor(syllables: Readonly<Syllable[]>) {
    super(syllables);
    this.randomNote = random_note_single_accidental();

    const syllableKeysInC = ObjectKeys(syllables_in_key_of_c) 
    const optionSyllableNotesInC = syllableKeysInC.filter((key) => {
      return syllables.includes(syllables_in_key_of_c[key] as Syllable);
    });

    const distanceToKey = Interval.distance("C", this.randomNote);
    const syllableNotesTransposed = optionSyllableNotesInC.transposeBy(distanceToKey);

    this.audio = [...Array(this.stepnumber).keys()].map((_) => {
      const note = syllableNotesTransposed.randomItem();
      const randomOctave = this.octaves.randomItem();

      const octaveNote = toOctave(note, randomOctave);
      if (isTooHigh(octaveNote)) {
        return note_transpose(octaveNote, IntervalDistance.OctaveDown);
      }

      if (isTooLow(octaveNote)) {
        return note_transpose(octaveNote, IntervalDistance.OctaveUp);
      }
      return octaveNote as noteAllAccidentalOctave;
    });

  }

  get quizHead() {
    return [];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio = this.audio.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out!
          toOctave(this.randomNote, "2"),
          toOctave(this.randomNote, "3"),
          toOctave(note_transpose(this.randomNote, "3M"), "3"),
          toOctave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", onInit: false, channel: 1, message: "play melody", display: true },
      { audio: keyAudio, keyboardKey: "l", onInit: true, channel: 2, message: "establish key" },
    ];
  }

  get tableHeader() {
    return this.audio.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 };
    });
  }

  static meta() {
    return {
      get getAllOptions(): Syllable[] {
        return ["Do", "Re", "Me", "Mi", "Fa", "Fi", "So", "La", "Ti"];
      },
      name: "Sing functional solfege degrees",
      description: "Sing the solfege degrees shown in the table below",
      instructions: [
        "It is tempting to start out with a limited ambitus of a single octave.",
        "This is not recommended. Instead one should begin with repeating scale degrees in multiple octaves.",
        "For instance: 'Do', 'Re', 'Mi' in 3 octaves. Then gradually add more degrees",
        "Begin by establishing the sound of the key. Then sing 'Do' in the different octaves.",
        "At first it is helpful to insert 'Do's and sing each degree back to 'Do' to better hear relationships of the degrees"
      ]
    };
  }
};
