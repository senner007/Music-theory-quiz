import { INotePlay } from "../midiplay";
import { IQuizInstance, IQuiz } from "../quiz-types";
import { ITableHeader, Syllable, syllables_in_key_of_c } from "../solfege";
import {
  is_too_high,
  is_too_low, 
  TNoteAllAccidentalOctave,
  TNoteSingleAccidental,
  TOctave,
  random_note_single_accidental,
  to_octave,
  note_transpose,
  ObjectKeys,
  get_interval_distance,
  EIntervalDistance
} from "../utils";
import { SingingQuizBase } from "./quizBase/singingQuizBase";

type optionType = [{ name : string, options : Syllable[]}]

export const SingingFunctionalDegrees: IQuiz<optionType> = class extends SingingQuizBase<optionType> {
  verifyOptions(options: optionType): boolean {
    return options[0].options.every((syllable) => Object.values(syllables_in_key_of_c).includes(syllable));
  }

  randomNote: TNoteSingleAccidental;
  octaves: TOctave[] = ["3", "4"]; // in options
  audio;
  stepnumber: number = 12; // in options
  override tempo = 1000;
  constructor(options: Readonly<optionType>) {
    super(options);
    this.randomNote = random_note_single_accidental();

    const syllableKeysInC = ObjectKeys(syllables_in_key_of_c) 
    const optionSyllableNotesInC = syllableKeysInC.filter((key) => {
      return options.firstAndOnly().options.includes(syllables_in_key_of_c[key] as Syllable);
    });

    const distanceToKey = get_interval_distance("C", this.randomNote)
    const syllableNotesTransposed = optionSyllableNotesInC.transposeBy(distanceToKey);

    this.audio = [...Array(this.stepnumber).keys()].map((_) => {
      const note = syllableNotesTransposed.randomItem();
      const randomOctave = this.octaves.randomItem();

      const octaveNote = to_octave(note, randomOctave);
      if (is_too_high(octaveNote)) {
        return note_transpose(octaveNote, EIntervalDistance.OctaveDown);
      }

      if (is_too_low(octaveNote)) {
        return note_transpose(octaveNote, EIntervalDistance.OctaveUp);
      }
      return octaveNote as TNoteAllAccidentalOctave;
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
          to_octave(this.randomNote, "2"),
          to_octave(this.randomNote, "3"),
          to_octave(note_transpose(this.randomNote, "3M"), "3"),
          to_octave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", message: "play melody", display: true } as const,
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel : true, message: "establish key" },
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
      get getAllOptions(): optionType {
        return [{ name : "Syllables", options : ["Do", "Re", "Me", "Mi", "Fa", "Fi", "So", "La", "Ti"]}];
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
