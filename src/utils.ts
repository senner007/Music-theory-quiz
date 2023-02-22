import { Note, ScaleType, ChordType, Interval } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Chord as ChordClass } from "@tonaljs/tonal";
import { Log } from "./logger/logSync";
import { LogError } from "./dev-utils";
import { MathFloor } from "./random-funcs";
import { IntervalDistance } from "./harmonicProgressions";

export function customExit() {
  Log.clear();
  Log.write("Bye for now");
  process.exit();
}

export function isInterrupt(err: unknown) {
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
export type baseNote = typeof baseNotes[number];
export type octave = "2" | "3" | "4" | "5";
export type noteSingleAccidental = Readonly<`${baseNote}b` | baseNote | `${baseNote}#`>;
export type noteSingleAccidentalOctave = Readonly<`${noteSingleAccidental}${octave}`>;
export type noteAllAccidental = Readonly<`${baseNote}bb` | `${baseNote}##` | "F###" | noteSingleAccidental>;
export type noteAllAccidentalOctave = Readonly<`${noteAllAccidental}${octave}`>;
export type intervalType = "2m" | "2M" | "3m" | "3M" | "4P" | "4A" | "5d" | "5P" | "6m" | "6M";

export function ObjectKeys<Obj extends {}>(obj: Obj): Readonly<(keyof Obj)[]> {
  return Object.keys(obj) as (keyof Obj)[];
}

export function isTooLow(n: noteAllAccidentalOctave) {
  return Note.sortedNames([n, "F3"])[0] === n;
}

export function isTooHigh(n: noteAllAccidentalOctave) {
  return Note.sortedNames([n, "G5"])[1] === n;
}

export function toOctave<T extends Readonly<noteAllAccidental>>(n: T, octave: octave) {
  return (n + octave) as noteAllAccidentalOctave;
}

export function add_octave_note(notes: readonly noteAllAccidentalOctave[]): readonly noteAllAccidentalOctave[] {
  return [...notes, Note.transpose(notes[0], IntervalDistance.OctaveUp) as noteAllAccidentalOctave];
}

export function create_scale(scaleTonic: noteSingleAccidental, scaleType: string): Scale {
  return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function create_chord(chordTonic: noteSingleAccidental, chordType: string) {
  return ChordClass.get(chordTonic + " " + chordType);
}

export function random_note_single_accidental() {
  function note_single_accidentals(note: baseNote) {
    const noteVariants = note_variants(note);
    const [_, second, third, fourth] = noteVariants;
    return [second, third, fourth] as Readonly<[`${baseNote}b`, baseNote, `${baseNote}#`]>;
  }

  const baseNote = baseNotes.randomItem();
  const notesSingleAccidental = note_single_accidentals(baseNote);
  return notesSingleAccidental.randomItem() as Readonly<noteSingleAccidental>;
}

export function base_notes() {
  return baseNotes.slice(0); // refactor with class an private basenotes
}

export function random_index<T>(arr: T[]) {
  return MathFloor(Math.random() * arr.length);
}

export function chromatic_scale_notes(scale: Scale) {
  if (scale.type !== "chromatic" || !scale.tonic || !baseNotes.includes(scale.tonic as baseNote)) {
    LogError("only a chromatic scale with a basenote tonic can be passed as argument");
  }
  return scale.notes as Readonly<noteSingleAccidental[]>;
}

export function scale_notes(scale: Scale) {
  return scale.notes as Readonly<noteAllAccidental[]>;
}

export function variant_to_base(note: noteAllAccidental) {
  return note.substring(0, 1) as Readonly<baseNote>;
}

export function scale_note_at_index(scale: Scale, index: number) {
  return scale.notes[index] as Readonly<noteAllAccidental>;
}

export function event_by_probability(chance: number) {
  return MathFloor(Math.random() * 100) < chance;
}


type NoteVariants = [`${baseNote}bb`, `${baseNote}b`, baseNote, `${baseNote}#`, `${baseNote}##`]

export function note_variants(
  baseNote: baseNote
): Readonly<NoteVariants> | Readonly<[...NoteVariants, `${baseNote}###`]> {
  const returnArray: NoteVariants = [
    Note.transpose(baseNote, "1dd") as `${baseNote}bb`,
    Note.transpose(baseNote, "1d") as `${baseNote}b`,
    baseNote as baseNote,
    Note.transpose(baseNote, "1A") as `${baseNote}#`,
    Note.transpose(baseNote, "1AA") as `${baseNote}##`,
  ];
  if (baseNote === "F") {
    return [...returnArray, Note.transpose(baseNote, "1AAA") as `${baseNote}###`] as [...NoteVariants, `${baseNote}###`];
  }
  return returnArray
}

export function note_transpose<T extends noteAllAccidental | noteAllAccidentalOctave>(note: T, interval: string): T {
  return Note.transpose(note, interval) as T;
}

export function note_transpose_by<T extends noteAllAccidental | noteAllAccidentalOctave>(
  interval: string
): (note: T) => T {
  return Note.transposeBy(interval) as unknown as (note: T) => T;
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

export function getIntervalDistance(first: string, second: string) {
  return Interval.distance(first, second) as intervalType
}

export function intervalToAbsolute(interval: intervalType) {
  return interval.replace(/[-]/g, "") as intervalType;
}
