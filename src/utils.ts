import { Note, ScaleType, ChordType, Interval, Key } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Chord as ChordClass } from "@tonaljs/tonal";
import { Log } from "./logger/logSync";
import { LogError } from "./dev-utils";
import { math_floor } from "./random_func";

export function customExit() {
  Log.clear();
  Log.write("Bye for now");
  process.exit();
}

export function is_interrupt(err: unknown) {
  return err === InterruptedPrompt.EVENT_INTERRUPTED;
}

export const allChordTypes = ChordType.all()
  .map((c: any) => c.name)
  .filter((name: any) => name !== "") // some of the chords don't have names ???
  .sort();

export const allScaleTypes = ScaleType.all()
  .map((s) => s.name)
  .sort();

const baseNotes = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type TBaseNote = typeof baseNotes[number];
export type TOctave = "2" | "3" | "4" | "5";
export type TNoteSingleAccidental = Readonly<`${TBaseNote}b` | TBaseNote | `${TBaseNote}#`>;
export type TNoteSingleAccidentalOctave = Readonly<`${TNoteSingleAccidental}${TOctave}`>;
export type TNoteAllAccidental = Readonly<`${TBaseNote}bb` | `${TBaseNote}##` | "F###" | TNoteSingleAccidental>;
export type TNoteAllAccidentalOctave = Readonly<`${TNoteAllAccidental}${TOctave}`>;
export type TIntervalType = "2m" | "2M" | "3m" | "3M" | "4P" | "4A" | "5d" | "5P" | "6m" | "6M" ;
export enum EIntervalDistance {
  OctaveUp = "8P",
  OctaveDown = "-8P",
}

export function ObjectKeys<Obj extends {}>(obj: Obj): Readonly<(keyof Obj)[]> {
  return Object.keys(obj) as (keyof Obj)[];
}

export function is_too_low(n: TNoteAllAccidentalOctave) {
  return Note.sortedNames([n, "F3"])[0] === n;
}

export function is_too_high(n: TNoteAllAccidentalOctave) {
  return Note.sortedNames([n, "G5"])[1] === n;
}

export function to_octave<T extends Readonly<TNoteAllAccidental>>(n: T, octave: TOctave) {
  return (n + octave) as TNoteAllAccidentalOctave;
}

export function add_octave_note(notes: readonly TNoteAllAccidentalOctave[]): readonly TNoteAllAccidentalOctave[] {
  return [...notes, Note.transpose(notes[0], EIntervalDistance.OctaveUp) as TNoteAllAccidentalOctave];
}

export function create_scale(scaleTonic: TNoteSingleAccidental, scaleType: string): Scale {
  return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function create_chord(chordTonic: TNoteSingleAccidental, chordType: string) {
  return ChordClass.get(chordTonic + " " + chordType);
}

export function random_note_single_accidental() {
  function note_single_accidentals(note: TBaseNote) {
    const noteVariants = note_variants(note);
    const [_, second, third, fourth] = noteVariants;
    return [second, third, fourth] as Readonly<[`${TBaseNote}b`, TBaseNote, `${TBaseNote}#`]>;
  }

  const baseNote = baseNotes.random_item();
  const notesSingleAccidental = note_single_accidentals(baseNote);
  return notesSingleAccidental.random_item() as Readonly<TNoteSingleAccidental>;
}

export function base_notes() {
  return baseNotes.slice(0); // refactor with class an private basenotes
}

export function random_index<T>(arr: T[]) {
  return math_floor(Math.random() * arr.length);
}

export function chromatic_scale_notes(scale: Scale) {
  if (scale.type !== "chromatic" || !scale.tonic || !baseNotes.includes(scale.tonic as TBaseNote)) {
    LogError("only a chromatic scale with a basenote tonic can be passed as argument");
  }
  return scale.notes as Readonly<TNoteSingleAccidental[]>;
}

export function scale_notes(scale: Scale) {
  return scale.notes as Readonly<TNoteAllAccidental[]>;
}

export function variant_to_base(note: TNoteAllAccidental) {
  return note.substring(0, 1) as Readonly<TBaseNote>;
}

export function scale_note_at_index(scale: Scale, index: number) {
  return scale.notes[index] as Readonly<TNoteAllAccidental>;
}

export function event_by_probability(chance: number) {
  return math_floor(Math.random() * 100) < chance;
}


type TNoteVariants = [`${TBaseNote}bb`, `${TBaseNote}b`, TBaseNote, `${TBaseNote}#`, `${TBaseNote}##`]

export function note_variants(
  baseNote: TBaseNote
): Readonly<TNoteVariants> | Readonly<[...TNoteVariants, `${TBaseNote}###`]> {
  const returnArray: TNoteVariants = [
    Note.transpose(baseNote, "1dd") as `${TBaseNote}bb`,
    Note.transpose(baseNote, "1d") as `${TBaseNote}b`,
    baseNote as TBaseNote,
    Note.transpose(baseNote, "1A") as `${TBaseNote}#`,
    Note.transpose(baseNote, "1AA") as `${TBaseNote}##`,
  ];
  if (baseNote === "F") {
    return [...returnArray, Note.transpose(baseNote, "1AAA") as `${TBaseNote}###`] as [...TNoteVariants, `${TBaseNote}###`];
  }
  return returnArray
}

export function note_transpose<T extends TNoteAllAccidental | TNoteAllAccidentalOctave>(note: T, interval: string): T {
  return Note.transpose(note, interval) as T;
}

export function note_transpose_by<T extends TNoteAllAccidental | TNoteAllAccidentalOctave>(
  interval: string
): (note: T) => T {
  return Note.transposeBy(interval) as unknown as (note: T) => T;
}

export function transpose_to_key(note: TNoteAllAccidentalOctave, key: TNoteAllAccidental | TNoteAllAccidentalOctave): TNoteAllAccidentalOctave {
  const interval = get_interval_distance(key, "C")
  return note_transpose(note, interval)
}

export function number_to_degree(n: number) {
  let degree = "";
  switch (n) {
    case 0:
      degree = "1st";
      break;
    case 1:
      degree = "2nd";
      break;
    case 2:
      degree = "3rd";
      break;
    case 3:
      degree = "4th";
      break;
    case 4:
      degree = "5th";
      break;
    case 5:
      degree = "6th";
      break;
    case 6:
      degree = "7th";
      break;
    default:
      LogError("Incompatible scale degree. Scale degree not in 7-note diatonic scale");
  }
  return degree;
}

export function get_interval_distance(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
  return Interval.distance(first, second) as TIntervalType // fix since intervals can be negative also (eg. -2M)
}

export function interval_integer(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
  return Interval.num(get_interval_distance(first, second)) as number
}

export function interval_integer_absolute(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
  return Math.abs(interval_integer(first, second)) as number
}

export function interval_to_absolute(interval: TIntervalType) {
  return interval.replace(/[-]/g, "") as TIntervalType;
}

export function interval_direction(interval: TIntervalType)  {
  return Interval.get(interval).dir as 1 | -1
}

export function get_key(note: TNoteSingleAccidental, keyType: "minor" | "major") {
  return keyType === "major" ? Key.majorKey(note) : Key.minorKey(note)
}

export function to_actave_above(notes: Readonly<TNoteAllAccidentalOctave[]>): TNoteAllAccidentalOctave[] {
  return notes.map((n) => Note.transpose(n, EIntervalDistance.OctaveUp)) as TNoteAllAccidentalOctave[];
}
