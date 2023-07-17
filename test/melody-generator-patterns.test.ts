import { expect, vi, describe, test, afterEach, Mock, it } from "vitest";
import { get_key } from "../src/tonal-interface";
import { melodyGenerator } from "../src/melodyGenerator/melodyGenerator";
import { MelodyChordal, MelodyPattern_001, MelodyPattern_002, MelodyTopSingulate} from "../src/melodyGenerator/melodyPatterns";
import { keyinfo } from "../src/keyinfo/keyInfo";
import { progression_to_chords, romanNumeralChord } from "../src/harmony/romanNumerals";
import { IProgression } from "../src/transposition";
import { test_Progressions } from "./melody-generator-results";
import { progressions } from "../src/harmony/harmonicProgressions";

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

    const progs = progressions.map(p => p.progressions).flat();

    for (const progression of progs) {

        const progressionChordNotes: IProgression = {
            chords: progression.chords.map((c) => romanNumeralChord(c)),
            bass: progression.bass,
        };

        const keyType = get_key("C", progression.isMajor ? "major" : "minor")
        const keyInfo = keyinfo(keyType);

        const melodyPatterns = [MelodyTopSingulate, MelodyChordal, MelodyPattern_001, MelodyPattern_002]

        const patterns = melodyPatterns.filter((p) => {
            return !progression.voiceLeading ? true : progression.voiceLeading.includes(p.globalConditions.id)
        });
        

        test.each(patterns)("should generate patterns without throwing an error", (pattern) => {
               
            if (progression.voiceLeading && !progression.voiceLeading.includes(pattern.globalConditions.id)) {
                return;
            }

            try {
                const melody = melodyGenerator(
                    progressionChordNotes,
                    pattern,
                    progression_to_chords(progressionChordNotes, keyInfo),
                    keyInfo
                );
    
                expect(melody.bass).toEqual(expect.arrayContaining([expect.any(String)]))
            } catch(error) {
                throw new Error(`Progression : ${progression.description}\n${error} ${pattern.id}`)
            }
           
        });
    }

})




