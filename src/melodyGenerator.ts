import { IProgression } from "./transposition";
import { getIntervalInteger, noteAllAccidentalOctave } from "./utils";

export interface IMelodicPattern {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly noteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: noteAllAccidentalOctave[],
    duration: 1 | 2 | 3 | 4
}

interface IMelodyGenerator {
    melody():  IMelodyFragment[]
}

interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(currentChord: readonly noteAllAccidentalOctave[],
        previousChord: readonly noteAllAccidentalOctave[],
        nextChord: readonly noteAllAccidentalOctave[]): IMelodyGenerator
}

abstract class MelodyGeneratorBase   {
   
    protected topNote;
    protected secondNote;
    constructor (
       protected currentChord: readonly noteAllAccidentalOctave[],
       protected previousChord: readonly noteAllAccidentalOctave[],
       protected nextChord: readonly noteAllAccidentalOctave[]
    )  {
        const topNote = this.currentChord.at(-1);
        this.topNote = topNote as noteAllAccidentalOctave;
        this.secondNote = currentChord.at(-2) as noteAllAccidentalOctave;
    };
    abstract  melody():  IMelodyFragment[];
  }


export function melodyPattern(
    progression: IProgression, 
    melodyGenerator: IMelodyGeneratorBase): IMelodicPattern {
    const melody = progression.chords.map((chord, index) => new melodyGenerator(chord, progression.chords[index - 1], progression.chords[index + 1]).melody())
    return {
        timeSignature: 4,
        melodyNotes: melody.flat(),
        bass: progression.bass
    }
}

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
        const intervalInteger = Math.abs(getIntervalInteger(this.topNote, this.secondNote));

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
