import { INotePlay } from "../midiplay";
import { IQuiz } from "./quiz-types";
import { ITableHeader, TSyllable, syllables_in_key_of_c } from "../solfege";
import { get_interval_distance, is_too_high, note_transpose, is_too_low } from "../tonal-interface";
import {
  TNoteAllAccidentalOctave,
  TNoteSingleAccidental,
  TOctave,
  random_note_single_accidental,
  to_octave,
  ObjectKeys,
  EIntervalDistance
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";

type TOptionType = [
  { name : string, options : TSyllable[]},
  { name : string, options : TOctave[]},
  { name : string, options : number[]}
]

export const AudiateFunctionalDegrees: IQuiz<TOptionType> = class extends AudiateQuizBase<TOptionType> {
  verify_options(options: TOptionType): boolean {
    return options[0].options.every((syllable) => Object.values(syllables_in_key_of_c).includes(syllable));
  }

  key: TNoteSingleAccidental;
  initAudio;
  stepnumber: number = 12; // in options
  timeSignature = 1 as const;
  constructor(options: Readonly<TOptionType>) {
    super(options);

    this.key = random_note_single_accidental();

    const syllableKeysInC = ObjectKeys(syllables_in_key_of_c) 
    const optionSyllableNotesInC = syllableKeysInC.filter((key) => {
      return options[0].options.includes(syllables_in_key_of_c[key]);
    });

    const distanceToKey = get_interval_distance("C", this.key)
    const syllableNotesTransposed = optionSyllableNotesInC.transpose_by(distanceToKey);

    const notes = options[2].options.random_item();

    this.initAudio = [...Array(notes).keys()].map((_) => {
      const note = syllableNotesTransposed.random_item();
      const randomOctave = options[1].options.random_item();

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

  get quiz_head() {
    return [
    ];
  }

  get question() {
    return "";
  }

  audio() {
    const audio = this.initAudio.map((n): INotePlay => {
      return { noteNames: [n], duration: 1 };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out!
          to_octave(this.key, "2"),
          to_octave(this.key, "3"),
          to_octave(note_transpose(this.key, "3M"), "3"),
          to_octave(note_transpose(this.key, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", message: "play melody", display: true } as const,
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel : true, message: "establish key" },
    ];
  }

  get table_header() {
    return this.initAudio.map((_, index): ITableHeader => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 };
    });
  }

  protected override initTempo : number = 500;

  static meta() {
    return {
      get all_options(): TOptionType {
        return [
          { name : "Syllables", options : ["Do", "Ra", "Re", "Me", "Mi", "Fa", "Fi", "So", "Le", "La","Ti"]},
          { name : "Octaves", options : ["2","3", "4"]},
          { name : "Notes", options : [6, 12, 18]},

        ];
      },
      name: "Audiate functional solfege degrees",
      description: "Audiate the solfege degrees shown in the table below",
      instructions: [
        "It is tempting to start out with a limited ambitus of a single octave.",
        "This is not recommended. Instead one should begin with repeating scale degrees in multiple octaves.",
        "For instance: 'Do', 'Re', 'Mi' in 3 octaves. Then gradually add more degrees",
        "Begin by establishing the sound of the key. Then audiate 'Do' in the different octaves.",
        "At first it is helpful to insert 'Do's and audiate each degree back to 'Do' to better hear relationships of the degrees"
      ]
    };
  }
};
