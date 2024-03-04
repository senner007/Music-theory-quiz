// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";

import { Log } from "./logger/logSync";
import { LogError } from "./dev-utils";
import { math_floor } from "./random_func";
import { interval_distance, interval_integer, note_transpose, note_variants } from "./tonal-interface";
import { Interval } from "@tonaljs/tonal";

export type TBaseNote = typeof baseNotes[number];
export type TOctave = "2" | "3" | "4" | "5";
export type TNoteSingleAccidental = Readonly<`${TBaseNote}b` | TBaseNote | `${TBaseNote}#`>;
export type TNoteSingleAccidentalOctave = Readonly<`${TNoteSingleAccidental}${TOctave}`>;
export type TNoteAllAccidental = Readonly<`${TBaseNote}bb` | `${TBaseNote}##` | "F###" | TNoteSingleAccidental>;
export type TNoteAllAccidentalOctave = Readonly<`${TNoteAllAccidental}${TOctave}`>;
export type IntervalModifier<TIntervalBase extends string> = `${TIntervalBase}A` | `${TIntervalBase}AA` | `${TIntervalBase}d` | `${TIntervalBase}dd`;
export type TIntervalAbsolute = 
  "1P" | IntervalModifier<"1"> | 
  "2m" | "2M" | IntervalModifier<"2"> |
  "3m" | "3M" | IntervalModifier<"3"> |
  "4P" | IntervalModifier<"4"> |
  "5P" | IntervalModifier<"5"> | 
  "6m" | "6M" | IntervalModifier<"6"> | 
  "7m" | "7M" | IntervalModifier<"7"> |
  "8P" | IntervalModifier<"8"> 
export enum EScaleSteps {
  Tonic = 0,
  SuperTonic = 1,
  Mediant = 2,
  SubDominant = 3,
  Dominant = 4,
  SubMediant = 5,
  Leading = 6
}


// Intervals that can be both positive and negative : "-2M", "2M"
export type TIntervalInteger = TIntervalAbsolute | `-${TIntervalAbsolute}`

export enum EIntervalDistance {
  OctaveUp = "8P",
  OctaveDown = "-8P",
}
export type TNoteVariants = [`${TBaseNote}bb`, `${TBaseNote}b`, TBaseNote, `${TBaseNote}#`, `${TBaseNote}##`]

export const baseNotes = ["C", "D", "E", "F", "G", "A", "B"] as const;

export function customExit(message : string = "Bye for now") {
  Log.clear();
  Log.write(message);
  process.exit();
}

export class FatalError extends Error {
  constructor(message: string) {
    super(message);
    Log.error("Fatal Error");
    this.name = "FatalError";
  }
}

export function is_interrupt(error: unknown) {
  return error === InterruptedPrompt.EVENT_INTERRUPTED;
}

export function is_fatal(error: unknown) {
  return error instanceof FatalError
}

export function to_octave<T extends Readonly<TNoteAllAccidental>>(n: T, octave: TOctave) {
  return (n + octave) as TNoteAllAccidentalOctave;
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

export function random_index(arr: any[]) {
  return math_floor(Math.random() * arr.length);
}

export function random_index_range(min: number , arr: any[]) {
  return math_floor(Math.random() * (arr.length - min) + min);
}


export function variant_to_base(note: TNoteAllAccidental) {
  return note.substring(0, 1) as Readonly<TBaseNote>;
}

export function event_by_probability(chance: number) {
  return math_floor(Math.random() * 100) < chance;
}

export function transpose_to_key(note: TNoteAllAccidentalOctave, key: TNoteAllAccidental | TNoteAllAccidentalOctave): TNoteAllAccidentalOctave {
  const interval = interval_distance(key, "C")
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

export function interval_integer_absolute(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
  return Math.abs(interval_integer(first, second)) as number
}

export function interval_simplify(interval: TIntervalInteger) {
  return Interval.simplify(interval) as TIntervalInteger
}

export const commonKeys: TNoteSingleAccidental[] = [
  "C",
  "C#",
  "Db",
  "D",
  "Eb",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "Bb",
  "B",
];


export function splitArrayInChunks<T>(arr : T[], chunkSize : number) {
  const chunks = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}
