import { Interval, Note } from "@tonaljs/tonal";
import { EIntervalDistance, TNoteAllAccidentalOctave, TNoteSingleAccidental, TOctave } from "./utils";

export interface IProgression {
  readonly chords: Readonly<(Readonly<TNoteAllAccidentalOctave[]>)[]>;
  readonly bass: readonly TNoteAllAccidentalOctave[];
}

export type transpositionBounds = { high: TNoteAllAccidentalOctave; low: TNoteAllAccidentalOctave };

export function transpose_progression( // Test me!
  progression: IProgression,
  key: TNoteSingleAccidental,
  bounds: transpositionBounds = { high: "G5", low: "C4" }
) {
  const distanceToKey = Interval.distance("C", key);
  const transposed: IProgression = transpose_progression_by_interval(progression, distanceToKey);
  return adjust_transposition_within_bounds(transposed, bounds);
}

function adjust_transposition_within_bounds(
  progression: IProgression,
  bounds: transpositionBounds) {
  const notesSorted = Note.sortedNames(progression.chords.flatMap((n) => n));
  const lowestNote = notesSorted[0];
  const highestNote = notesSorted[notesSorted.length - 1];

  if (Note.sortedNames([bounds.low, lowestNote])[0] === lowestNote) {
    return transpose_progression_by_interval(progression, EIntervalDistance.OctaveUp);
  }
  if (Note.sortedNames([bounds.high, highestNote])[1] === highestNote) {
    return transpose_progression_by_interval(progression, EIntervalDistance.OctaveDown);
  }
  return progression;
}

export function transpose_progression_by_interval(progression: IProgression, interval: string) {
  return {
    chords: progression.chords.map((c) => c.transposeBy(interval)),
    bass: progression.bass.transposeBy(interval),
  } as const;
}

export function transpose_to_ascending(
  n: Readonly<TNoteAllAccidentalOctave>,
  index: number,
  arr: readonly TNoteAllAccidentalOctave[]
) {
  if (index === 0) return n;
  const getInterval = Interval.distance(arr[0], n);
  const intervalData = Interval.get(getInterval);
  return (intervalData.semitones! <= 0 ? Note.transpose(n, EIntervalDistance.OctaveUp) : n) as Readonly<TNoteAllAccidentalOctave>;
}
