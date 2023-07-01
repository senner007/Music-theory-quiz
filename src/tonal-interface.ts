import { ChordType, Interval, Key, Note, ScaleType } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Chord as ChordClass } from "@tonaljs/tonal";
import { EIntervalDistance, TBaseNote, TIntervalAbsolute, TIntervalIntegers, TNoteAllAccidental, TNoteAllAccidentalOctave, TNoteSingleAccidental, TNoteSingleAccidentalOctave, TNoteVariants, baseNotes } from "./utils";
import { LogError } from "./dev-utils";

export function is_too_low(n: TNoteAllAccidentalOctave, lowest: TNoteAllAccidentalOctave = "F3") {
    return Note.sortedNames([n, lowest])[0] === n;
}

export function is_too_high(n: TNoteAllAccidentalOctave, highest: TNoteSingleAccidentalOctave = "G5") {
    return Note.sortedNames([n, highest])[1] === n;
}

export const allChordNamesSorted = ChordType.all()
    .map((c: any) => c.name)
    .filter((name: any) => name !== "") // some of the chords don't have names ???
    .sort();

export const allScaleNamesSorted = ScaleType.all()
    .map((s) => s.name)
    .sort();

export function add_octave_above(notes: readonly TNoteAllAccidentalOctave[]): readonly TNoteAllAccidentalOctave[] {
    return [...notes, Note.transpose(notes[0], EIntervalDistance.OctaveUp) as TNoteAllAccidentalOctave];
}

export function to_octave_above(notes: Readonly<TNoteAllAccidentalOctave[]>): TNoteAllAccidentalOctave[] {
    return notes.map((n) => Note.transpose(n, EIntervalDistance.OctaveUp)) as TNoteAllAccidentalOctave[];
}

export function create_scale(scaleTonic: TNoteSingleAccidental, scaleType: string): Scale {
    return ScaleClass.get(scaleTonic + " " + scaleType);
}

export function create_chord(chordTonic: TNoteSingleAccidental, chordType: string) {
    return ChordClass.get(chordTonic + " " + chordType);
}

export function note_transpose<T extends TNoteAllAccidental | TNoteAllAccidentalOctave>(note: T, interval: string): T {
    return Note.transpose(note, interval) as T;
}

export function note_transpose_by<T extends TNoteAllAccidental | TNoteAllAccidentalOctave>(
    interval: string
): (note: T) => T {
    return Note.transposeBy(interval) as unknown as (note: T) => T;
}

export function interval_from_semitones(semitones: number) {
    return Interval.fromSemitones(semitones) as TIntervalIntegers;
}

export function interval_distance(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
    return Interval.distance(first, second) as TIntervalIntegers
}

export function interval_integer(first: TNoteAllAccidental | TNoteAllAccidentalOctave, second: TNoteAllAccidental | TNoteAllAccidentalOctave) {
    return Interval.num(interval_distance(first, second)) as number
}

export function interval_to_absolute(interval: TIntervalIntegers) {
    return interval.replace(/[-]/g, "") as TIntervalAbsolute;
}

export function interval_direction(interval: TIntervalIntegers) {
    return Interval.get(interval).dir as 1 | -1
}

export function get_key(note: TNoteSingleAccidental, keyType: "minor" | "major") {
    return keyType === "major" ? Key.majorKey(note) : Key.minorKey(note)
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

export function scale_note_at_index(scale: Scale, index: number) {
    return scale.notes[index] as Readonly<TNoteAllAccidental>;
}

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

export function scale_range(scale: TNoteAllAccidental[], note: TNoteAllAccidentalOctave, rangefrom : EIntervalDistance, rangeto  : EIntervalDistance) {
    let scaleRange = ScaleClass.rangeOf(scale);
    return scaleRange(note_transpose(note, rangefrom), note_transpose(note, rangeto)) as TNoteAllAccidentalOctave[];
}