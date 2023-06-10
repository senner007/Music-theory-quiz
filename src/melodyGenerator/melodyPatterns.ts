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
    static id = "pattern_002";
    static description = "Arpeggiate chord from top as sixteenth notes";
    public melody() {

        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        if (!this.nextChord) {
            return [
                { note: [this.topNote], duration: 4 as const },
            ]
        }
        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.topNote], duration: 1 as const },
                { note: [this.secondNote], duration: 1 as const },
                { note: [this.thirdNote], duration: 1 as const },
                { note: [this.secondNote], duration: 1 as const }
            ]
        } else {
            return[
                { note: [this.topNote], duration: 1 as const },
                { note: [this.thirdNote], duration: 1 as const },
                { note: [this.secondNote], duration: 1 as const },
                { note: [this.thirdNote], duration: 1 as const },
            ]
        }
    }
}