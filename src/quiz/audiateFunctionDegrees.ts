import { INotePlay } from "../midiplay";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import { ITableHeader, TSyllable, syllables_in_key_of_c } from "../solfege";
import { interval_distance, is_higher_than_high_bound, note_transpose, is_lower_than_low_bound } from "../tonal-interface";
import {
  TNoteAllAccidentalOctave,
  TNoteSingleAccidental,
  TOctave,
  random_note_single_accidental,
  to_octave,
  EIntervalDistance,
  commonKeys
} from "../utils";
import { AudiateQuizBase } from "./quizBase/audiateQuizBase";
import { ObjectEntries } from "../objectUtils";


const options = [
  { name : "Syllables", options : () => ["Do", "Ra", "Re", "Me", "Mi", "Fa", "Fi", "So", "Le", "La","Ti"] as TSyllable[], cliShort : "s"},
  { name : "Octaves", options : () =>  ["2","3", "4"] as const, cliShort : "o"},
  { name : "Notes", options : () =>  ["6", "12", "18"] as const, cliShort : "n"},
  { name : "Keys",  options: () => commonKeys, cliShort : "k" }
] as const;

type TOptionsType = typeof options;

export const AudiateFunctionalDegrees: IQuiz<TOptionsType> = class extends AudiateQuizBase<TOptionsReturnType<TOptionsType>> {

  verify_options(options: TOptionsReturnType<TOptionsType>): boolean {
    return options.first().options.every((syllable) => Object.values(syllables_in_key_of_c).includes(syllable));
  }

  randomKey
  initAudio;
  timeSignature = 1 as const;
  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);

    const [syllableOptions, octaveOptions, nNotesOptions, optionsKeys] = options;

    this.randomKey = optionsKeys.options.random_item();

    const syllableKeysInC = ObjectEntries(syllables_in_key_of_c).keys 
    const optionSyllableNotesInC = syllableKeysInC.filter((key) => {
      return syllableOptions.options.includes(syllables_in_key_of_c[key]);
    });

    const distanceToKey = interval_distance("C", this.randomKey)
    const syllableNotesTransposed = optionSyllableNotesInC.transpose_by(distanceToKey);

    const notes = nNotesOptions.options.random_item();

    this.initAudio = [...Array(Number(notes)).keys()].map((_) => {
      const note = syllableNotesTransposed.random_item();
      const randomOctave = octaveOptions.options.random_item();

      const octaveNote = to_octave(note, randomOctave);
      if (is_higher_than_high_bound(octaveNote)) {
        return note_transpose(octaveNote, EIntervalDistance.OctaveDown);
      }

      if (is_lower_than_low_bound(octaveNote)) {
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
    const audio = this.initAudio.map((n)  => {
      return { noteNames: [n], duration: 1 } as const;
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out!
          to_octave(this.randomKey, "2"),
          to_octave(this.randomKey, "3"),
          to_octave(note_transpose(this.randomKey, "3M"), "3"),
          to_octave(note_transpose(this.randomKey, "5P"), "3"),
        ],
        duration: 2,
      } as const,
    ];

    return [
      { audio: audio, keyboardKey: "space", message: "play melody", display: true, solo : true },
      { audio: keyAudio, keyboardKey: "l", onInit: true, backgroundChannel : true, message: "establish key", solo : true },
    ] as const;
  }

  get table_header() {
    return this.initAudio.map((_, index) => {
      index++;
      return { name: index.toString().padStart(2, '0'), duration: 1 } as const;
    });
  }

  protected override initTempo : number = 500;

  static meta() {
    return {
      get all_options() {
        return options;
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
