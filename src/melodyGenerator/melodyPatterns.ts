import { Scale } from "@tonaljs/tonal";
import { EIntervalDistance, TNoteAllAccidentalOctave, get_interval_integer, note_transpose } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";
import { INotePlay } from "../midiplay";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "singular";
    static description = "Top notes only";
    public melody() {
        return [
            { note: [this.topNote], duration: 4 as const }
        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_001";
    static description = "Tertian chord note skip from top note, 1st inversion chords top note only";
    public melody() {



        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.topNote], duration: 2 as const },
                { note: [this.secondNote], duration: 2 as const }
            ]
        } else {
            return [
                { note: [this.topNote], duration: 4 as const }
            ]
        }
    }
}

export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_001";
    static description = "Arpeggiate chord from top as sixteenth notes";
    public melody() {

        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.keyInfo.harmonic.scale
        } else {
            scale = this.keyInfo.scale
        }

        const range = Scale.rangeOf(scale)(this.topNote,  note_transpose(this.topNote, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];

        if (!this.nextChord) {
            return [
                { note: [this.topNote], duration: 4 as const },
            ]
        }
        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.secondNote], duration: 2 as const },
                { note: [this.topNote], duration: 2 as const },
            ]
        } else {
            if (range.at(1) === this.secondNote) {
                return[
                    { note: [this.topNote], duration: 2 as const },
                    { note: [this.secondNote], duration: 2 as const },
                ]
            }
            return[
                { note: [this.topNote], duration: 1 as const },
                { note: [range.at(1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                // create instead a function that gets the closest note below the top note from all minor scales
                { note: [this.topNote], duration: 2 as const },
            ]
        }
    }
}