import { LogError } from "./dev-utils";
import { INotePlay } from "./midiplay";
import { TNoteAllAccidentalOctave, TNoteSingleAccidental, TNoteAllAccidental, transpose_to_key } from "./utils";
import { interval_distance, interval_semitones, sortNotes } from "./tonal-interface";

export interface ITableHeader {
  name: Readonly<string>,
  duration: INotePlay['duration']
}

export type TSolfegeDict = keyof typeof syllables_in_key_of_c;

export type TSyllable = typeof syllables_in_key_of_c[TSolfegeDict];

export class SolfegeMelody {
  private verify_duration_length() {
    if (this.duration() > 40) LogError("Melody duration exceeded");
  }

  private sortedMelody;
  constructor(private melody: INotePlay[], private key: TNoteSingleAccidental, private timeSignature: 1 | 2 | 3 | 4) {
    this.sortedMelody = this.sort_melody();
    this.verify_duration_length();
  }

  private sort_melody(): TNoteAllAccidentalOctave[] {
    const flatMelody = this.melody.map((n) => n.noteNames).flat();
    return sortNotes(flatMelody);
  }

  public get getMelody() {
    return Object.freeze(this.melody);
  }

  public get lowest(): TNoteAllAccidentalOctave {
    return this.sortedMelody.first();
  }

  private get highest(): TNoteAllAccidentalOctave {
    return this.sortedMelody.last()
  }

  get length() {
    return this.melody.length;
  }

  durationAccumulation() {
    return this.melody.map((n) => n.duration).reduce((accumulator, current, index) =>
      [...accumulator, { index, total: (accumulator.last()?.total || 0) + current }], [] as { index: number, total: number }[]);
  }

  duration(): number {
    return this.melody.map((n) => n.duration).reduce((a, b) => a + b, 0);
  }

  pagination(maxDuration: number, timeSignature: 1 | 2 | 3 | 4) {
    if (this.duration() > maxDuration) {
      const half = this.durationAccumulation().filter(d => d.total === maxDuration - (maxDuration % this.timeSignature)).first_and_only().index;
      const firstHalf = this.getMelody.slice(0, half + 1)
      const secondHalf = this.getMelody.slice(half + 1)
      return [
        new SolfegeMelody(firstHalf, this.key, this.timeSignature),
        new SolfegeMelody(secondHalf, this.key, this.timeSignature)
      ]

    }
    return [this];
  }

  syllable(note: TNoteAllAccidentalOctave): TSyllable {
    const transposedNote = transpose_to_key(note, this.key);
    return syllables_in_key_of_c[remove_octave(transposedNote)];
  }

  distance_from_lowest(note: TNoteAllAccidentalOctave, lowest: TNoteAllAccidentalOctave) {
    const intervalDistance = interval_distance(lowest, note);
    const semitones = interval_semitones(intervalDistance);
    if (!semitones) {
      LogError("Semitone calculation error")
    }
    return semitones
  }

  ambitus(lowest: TNoteAllAccidentalOctave): number {
    const semitones = this.distance_from_lowest(this.highest, lowest);
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
  "Dbb": "---",
  Db: "Ra",
  D: "Re",
  "D#": "Ri",
  "D##": "Rai",
  "Ebb": "Maw",
  "Eb": "Me",
  E: "Mi",
  "E#": "Mai",
  "E##": "---",
  "Fbb": "---",
  Fb: "Fe",
  F: "Fa",
  "F#": "Fi",
  "F##": "Fai",
  "F###": "---",
  "Gbb": "Saw",
  Gb: "Se",
  G: "So",
  "G#": "Si",
  "G##": "Sai",
  "Abb": "Law",
  Ab: "Le",
  A: "La",
  "A#": "Li",
  "A##": "Lai",
  "Bbb": "Taw",
  Bb: "Te",
  B: "Ti",
  "B#": "Tai",
  "B##": "---"
} as const;

export function remove_octave(note: TNoteAllAccidentalOctave) {
  return note.replace(/[0-9]/g, "") as TNoteAllAccidental;
}


