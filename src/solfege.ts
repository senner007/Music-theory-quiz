import { Interval, Note } from "@tonaljs/tonal";
import { LogError } from "./dev-utils";
import { INotePlay } from "./midiplay";
import { noteAllAccidentalOctave, noteSingleAccidental, noteAllAccidental, octave, noteSingleAccidentalOctave } from "./utils";

export class SolfegeMelody {
  private verify_duration_length() {
    if (this.duration > 30) LogError("Melody duration exceeded");
  }

  private sortedMelody;
  constructor(private melody: INotePlay[], private key: noteSingleAccidental) {
    this.sortedMelody = this.sort_melody();
    this.verify_duration_length();
  }

  private transpose_to_melody_key(note: noteAllAccidentalOctave): noteAllAccidentalOctave {
    const interval = Interval.distance(this.key, "C");
    return Note.transpose(note, interval) as noteAllAccidentalOctave;
  }

  private sort_melody(): noteAllAccidentalOctave[] {
    const flatMelody = this.melody.map((n) => n.noteNames).flat();
    return Note.sortedNames(flatMelody) as noteAllAccidentalOctave[];
  }

  public get getMelody() {
    return Object.freeze(this.melody);
  }

  private get lowest(): noteAllAccidentalOctave {
    return this.sortedMelody[0];
  }

  private get highest(): noteAllAccidentalOctave {
    return this.sortedMelody.at(-1) as noteAllAccidentalOctave;
  }

  get length() {
    return this.melody.length;
  }

  get duration(): number {
    return this.melody.map((n) => n.duration).reduce((a, b) => a + b, 0);
  }

  syllable(note: noteAllAccidentalOctave): Syllable {
    const transposedNote = this.transpose_to_melody_key(note);
    return syllables_in_key_of_c[remove_octave(transposedNote)] as Syllable;
  }

  distance_from_lowest(note: noteAllAccidentalOctave): number {
    const intervalDistance = Interval.distance(this.lowest, note);
    return Interval.semitones(intervalDistance) as number;
  }

  ambitus(): number {
    const semitones = this.distance_from_lowest(this.highest);
    if (!semitones) LogError("Semitone calculation error");
    return semitones;
  }
}

export const syllables_in_key_of_c = {
  Cbb: "Daw",
  Cb: "De",
  C: "Do",
  "C#": "Di",
  "C##": "Dai",
  "Dbb" : "---",
  Db: "Ra",
  D: "Re",
  "D#": "Ri",
  "D##" : "Rai",
  "Ebb" : "Maw",
  "Eb" : "Me",
  E: "Mi",
  "E#": "Mai",
  "E##" : "---",
  "Fbb" : "---",
  Fb: "Fe",
  F: "Fa",
  "F#": "Fi",
  "F##": "Fai",
  "F###": "---",
  "Gbb": "Saw",
  Gb: "Se",
  G: "So",
  "G#": "Si",
  "G##" : "Sai",
  "Abb": "Law",
  Ab: "Le",
  A: "La",
  "A#": "Li",
  "A##" : "Lai",
  "Bbb" : "Taw",
  Bb: "Te",
  B: "Ti",
  "B#": "Tai",
  "B##" : "---"
} as const;

export type solfegeDict = keyof typeof syllables_in_key_of_c;

export type Syllable = typeof syllables_in_key_of_c[solfegeDict];

function remove_octave(note: noteAllAccidentalOctave) {
  return note.replace(/[0-9]/g, "") as noteAllAccidental;
}

export interface ITableHeader {
  name: Readonly<string>,
  duration: INotePlay['duration']
}

