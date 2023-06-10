import { Note } from "@tonaljs/tonal";
import { expect, describe, test, it } from "vitest";
import { progressions} from "../src/harmony/harmonicProgressions";
import { IProgression, transpose_progression, transpositionBounds } from "../src/transposition";
import { romanNumeralChord } from "../src/harmony/romanNumerals";

describe("Test progression transposition methods", () => {

    const bounds: transpositionBounds = { high: "B5", low: "C4" }

    const firstProgression: IProgression = {
        chords: progressions[0].progressions[0].chords.map((c) => romanNumeralChord(c)),
        bass: progressions[0].progressions[0].bass,
    };
    const highestNoteInChords = Note.sortedNames(
        firstProgression.chords.flatMap((n) => n),
        Note.descending
    )[0];

    it("should transpose progression down an octave within default bounds when transposing up a fourth",
        () => {

            const progressionTransposed = transpose_progression(firstProgression, "F");

            const highestNoteInTransposedChords = Note.sortedNames(
                progressionTransposed.chords.flatMap((n) => n),
                Note.descending
            )[0];

            expect(highestNoteInChords).toEqual("D5");
            expect(highestNoteInTransposedChords).toEqual("G4");
        }
    );

    test.each([bounds] as transpositionBounds[])(
        "should not transpose progression down an octave within custum bounds when transposing up a fourth",
        (bounds: transpositionBounds) => {

            const progressionTransposed = transpose_progression(firstProgression, "F", bounds);

            const highestNoteInTransposedChords = Note.sortedNames(
                progressionTransposed.chords.flatMap((n) => n),
                Note.descending
            )[0];

            expect(highestNoteInChords).toEqual("D5");
            expect(highestNoteInTransposedChords).toEqual("G5");
        }
    );
});
