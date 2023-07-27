import { EIntervalDistance, TIntervalInteger, TNoteAllAccidentalOctave, TNoteSingleAccidental, TNoteSingleAccidentalOctave } from "./utils";
import { interval_data, interval_distance, is_higher_than_high_bound, is_lower_than_low_bound, note_transpose, sortNotes } from "./tonal-interface";

export interface IProgression {
  readonly chords: Readonly<(Readonly<TNoteAllAccidentalOctave[]>)[]>;
  readonly bass: readonly TNoteAllAccidentalOctave[];
}

export type transpositionBounds = { high: TNoteSingleAccidentalOctave; low: TNoteSingleAccidentalOctave };

export function transpose_progression( // Test me!
  progression: IProgression,
  key: TNoteSingleAccidental,
  bounds: transpositionBounds = { high: "G5", low: "C4" }
) {
  const distanceToKey = interval_distance("C", key);
  const transposed: IProgression = transpose_progression_by_interval(progression, distanceToKey);
  return adjust_transposition_within_bounds(transposed, bounds);
}

function adjust_transposition_within_bounds(
  progression: IProgression,
  bounds: transpositionBounds) {
  const notesSorted = sortNotes(progression.chords.flatMap((n) => n));
  const lowestNote = notesSorted.first_or_throw();
  const highestNote = notesSorted.last_or_throw();

  if (is_lower_than_low_bound(lowestNote, bounds.low)) {
    return transpose_progression_by_interval(progression, EIntervalDistance.OctaveUp);
  }
  if (is_higher_than_high_bound(highestNote, bounds.high)) {
    return transpose_progression_by_interval(progression, EIntervalDistance.OctaveDown);
  }
  return progression;
}

export function transpose_progression_by_interval(progression: IProgression, interval: TIntervalInteger) {
  return {
    chords: progression.chords.map((c) => c.transpose_by(interval)),
    bass: progression.bass.transpose_by(interval),
  } as const;
}

export function transpose_to_ascending(
  n: Readonly<TNoteAllAccidentalOctave>,
  index: number,
  arr: readonly TNoteAllAccidentalOctave[]
) {
  if (index === 0) return n;
  const interval = interval_distance(arr.first_or_throw(), n);
  const intervalData = interval_data(interval);
  return (intervalData.semitones! <= 0 ? note_transpose(n, EIntervalDistance.OctaveUp) : n) as Readonly<TNoteAllAccidentalOctave>;
}
