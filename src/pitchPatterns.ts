import { TNoteAllAccidental } from "./utils";
import { Interval, Note } from "@tonaljs/tonal";

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

export type TPitchPatternName = keyof typeof pitchPatterns;

type TPattern = typeof pitchPatterns[TPitchPatternName];


export function get_pattern(patternName : TPitchPatternName) {
    return pitchPatterns[patternName];
}


export function pattern_intervals(pattern: TPattern): [string, string] {
    return [Interval.fromSemitones(pattern[1]), Interval.fromSemitones(pattern[2] - pattern[1])]
}

export function pitch_pattern_inversions(note: TNoteAllAccidental, intervals : [string, string]) {
    const note2 = Note.transpose(note, intervals[0]) as TNoteAllAccidental;
    const note3 = Note.transpose(note2, intervals[1]) as TNoteAllAccidental;

    const note2Inversion = Note.transpose(note, intervals[1]) as TNoteAllAccidental;

    return [
        [note, note2, note3],
        [note, note2Inversion, note3]
    ]
}
