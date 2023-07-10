import { expect, vi, describe, test, afterEach, Mock, it } from "vitest";
import { get_key } from "../src/tonal-interface";
import { melodyGenerator } from "../src/melodyGenerator/melodyGenerator";
import { MelodyPattern_001} from "../src/melodyGenerator/melodyPatterns";
import { keyinfo } from "../src/keyinfo/keyInfo";
import { progression_to_chords, romanNumeralChord } from "../src/harmony/romanNumerals";
import { IProgression } from "../src/transposition";
import { test_Progressions } from "./melody-generator-results";

describe("Test progression generate expected melodic patterns", () => {

    for (const progression of test_Progressions) {

        const progressionChordNotes: IProgression = {
            chords: progression.chords.map((c) => romanNumeralChord(c)),
            bass: progression.bass,
        };

        const keyType = get_key("C", progression.isMajor ? "major" : "minor")
        const keyInfo = keyinfo(keyType);

        test.each([MelodyPattern_001])("should generate expected pattern", (pattern) => {
            const melody = melodyGenerator(
                progressionChordNotes,
                pattern,
                progression_to_chords(progressionChordNotes, keyInfo),
                keyInfo
            );

            expect(melody.melodyNotes).toEqual(progression.patterns[pattern.id])
        });
    }

})



