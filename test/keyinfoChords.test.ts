import { expect, vi, describe, test, afterEach, Mock } from "vitest";
import { keyinfo, key_chords } from "../src/keyinfo/keyInfo";
import { get_key } from "../src/tonal-interface";
import { TChord } from "../src/quiz/audiateHarmony"

const keyTypeMajor = get_key("C", "major")
const keyTypeMinor = get_key("C", "major")
const keyTypes = [keyTypeMajor, keyTypeMinor]

describe("Test chords returned from keyinfo", () => {

    for (const keyType of keyTypes) {

        const keyInfo = keyinfo(keyType);
        const keyInfoChords = key_chords(keyInfo)

        test.each(keyInfoChords)("chords must have a tonic", (chord: TChord) => {
            try {
      
                expect(chord.tonic).not.toBeNull();
                expect(chord.tonic.length).toBeGreaterThan(0);
                expect(chord.tonic[0]).not.toEqual(" ");
            } catch (error) {

                throw new Error(`Progression : ${chord.tonic}\n${error}`)
            }
        });

        test.each(keyInfoChords)("chords must have a symbol", (chord: TChord) => {
            try {
                expect(chord.symbol).not.toBeNull();
                expect(chord.symbol.length).toBeGreaterThan(0);
                expect(chord.symbol[0]).not.toEqual(" ");
            } catch (error) {

                throw new Error(`Progression : ${chord.symbol}\n${error}`)
            }
        });

        test.each(keyInfoChords)("chords must have notes", (chord: TChord) => {
            try {
                expect(chord.notes).toEqual(expect.arrayContaining([expect.any(String)]));
                expect(chord.notes.length).toBeGreaterThan(2);
            } catch (error) {
                throw new Error(`Progression : ${chord.notes}\n${error}`)
            }
        });
    }

})


