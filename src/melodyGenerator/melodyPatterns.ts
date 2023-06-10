import { get_interval_integer } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase{
    static id = "singular";
    static description = "Top notes only";
    public melody() {
        return [
            { note: [this.topNote], duration: 4 as const}
        ] 
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase{
    static id = "pattern_001";
    static description = "Tertian chord note skip from top note, 1st inversion chords top note only";
    public melody() {
        const intervalInteger = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        if (intervalInteger === 3) {
            return [
                { note: [this.topNote], duration: 2 as const },
                { note: [this.secondNote], duration: 2 as const}
            ]
        } else {
            return [
                { note: [this.topNote], duration: 4 as const}
            ]
        }
    }
}