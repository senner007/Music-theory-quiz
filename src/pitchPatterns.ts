import { interval_from_semitones, note_transpose } from "./tonal-interface";
import { TIntervalIntegers, TNoteAllAccidental } from "./utils";

export type TPitchPatternName = keyof typeof pitchPatterns;

type TPattern = typeof pitchPatterns[TPitchPatternName];

export const pitchPatterns = {
    "013": [0, 1, 3],
    "014": [0, 1, 4],
    "015": [0, 1, 5],
    "016": [0, 1, 6],
    "024": [0, 2, 4],
    "025": [0, 2, 5],
    "026": [0, 2, 6],
    "027": [0, 2, 7],
    "036": [0, 3, 6],
    "037": [0, 3, 7],
    "048": [0, 4, 8],
} as const;


export function pitch_pattern_by_name(patternName : TPitchPatternName) {
    return pitchPatterns[patternName];
}

export function pattern_intervals(pattern: TPattern): [TIntervalIntegers, TIntervalIntegers] {
    return [interval_from_semitones(pattern[1]), interval_from_semitones(pattern[2] - pattern[1])]
}

export function pitch_pattern_inversions(note: TNoteAllAccidental, intervals : [TIntervalIntegers, TIntervalIntegers]) {
    const note2 = note_transpose(note, intervals[0]);
    const note3 = note_transpose(note2, intervals[1]);

    const note2Inversion = note_transpose(note, intervals[1]);

    return [
        [note, note2, note3],
        [note, note2Inversion, note3]
    ]
}
