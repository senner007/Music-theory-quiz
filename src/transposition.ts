import { Interval, Note } from "@tonaljs/tonal";
import { IntervalDistance } from "./harmonicProgressions";
import { noteAllAccidental, noteAllAccidentalOctave, noteSingleAccidental, octave } from "./utils";


export interface IProgression {
  readonly chords: Readonly<(Readonly<noteAllAccidentalOctave[]>)[]>;
  readonly bass: readonly noteAllAccidentalOctave[];
}

export type transpositionBounds = { high: noteAllAccidentalOctave; low: noteAllAccidentalOctave };

export function transposeProgression( // Test me!
  progression: IProgression,
  key: noteSingleAccidental,
  bounds: transpositionBounds = { high: "G5", low: "C4" }
) {
  const distanceToKey = Interval.distance("C", key);
  const transposed: IProgression = transposeProgressionByInterval(progression, distanceToKey);
  return adjustTranspositionWithinBounds(transposed, bounds);
}

function adjustTranspositionWithinBounds(
  progression: IProgression,
  bounds: transpositionBounds) {
  const notesSorted = Note.sortedNames(progression.chords.flatMap((n) => n));
  const lowestNote = notesSorted[0];
  const highestNote = notesSorted[notesSorted.length - 1];

  if (Note.sortedNames([bounds.low, lowestNote])[0] === lowestNote) {
    return transposeProgressionByInterval(progression, IntervalDistance.OctaveUp);
  }
  if (Note.sortedNames([bounds.high, highestNote])[1] === highestNote) {
    return transposeProgressionByInterval(progression, IntervalDistance.OctaveDown);
  }
  return progression;
}

export function transposeProgressionByInterval(progression: IProgression, interval: string) {
  return {
    chords: progression.chords.map((c) => c.transposeBy(interval)),
    bass: progression.bass.transposeBy(interval),
  } as const;
}

export function transpose_to_ascending(
  n: Readonly<noteAllAccidentalOctave>,
  index: number,
  arr: readonly noteAllAccidentalOctave[]
) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return (intervalData.semitones! <= 0 ? Note.transpose(n, IntervalDistance.OctaveUp) : n) as Readonly<noteAllAccidentalOctave>;
}
