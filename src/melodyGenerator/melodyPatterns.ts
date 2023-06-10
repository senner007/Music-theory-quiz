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
    static description = "1st - 2nd (M3/m3), 1st (.)";
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
    static description = "2nd - 1st (M3/m3), 1st-(NT-below)-1st (.)";
    public melody() {

        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.keyInfo.harmonic.scale
        } else {
            scale = this.keyInfo.scale
        }

        const range = Scale.rangeOf(scale)(this.topNote,  note_transpose(this.topNote, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];

        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.secondNote], duration: 2 as const },
                { note: [this.topNote], duration: 2 as const },
            ]
        } else {
            return[
                { note: [this.topNote], duration: 1 as const },
                { note: [range.at(1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                // create instead a function that gets the closest note below the top note from all minor scales
                { note: [this.topNote], duration: 2 as const },
            ]
        }
    }
}