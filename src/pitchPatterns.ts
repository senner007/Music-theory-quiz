import { noteAllAccidental } from "./utils";
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

export type pitchPatternName = keyof typeof pitchPatterns;

type pattern = typeof pitchPatterns[pitchPatternName];


export function getPattern(patternName : pitchPatternName) {
    return pitchPatterns[patternName];
}


export function getPatternIntervals(pattern: pattern): [string, string] {
    return [Interval.fromSemitones(pattern[1]), Interval.fromSemitones(pattern[2] - pattern[1])]
}

export function getPitchPatternInversions(note: noteAllAccidental, intervals : [string, string]) {
    const note2 = Note.transpose(note, intervals[0]) as noteAllAccidental;
    const note3 = Note.transpose(note2, intervals[1]) as noteAllAccidental;

    const note2Inversion = Note.transpose(note, intervals[1]) as noteAllAccidental;

    return [
        [note, note2, note3],
        [note, note2Inversion, note3]
    ]
}
