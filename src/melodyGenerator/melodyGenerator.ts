import { IProgression } from "../transposition";
import { getIntervalInteger, noteAllAccidentalOctave } from "../utils";

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

export interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(currentChord: readonly noteAllAccidentalOctave[],
        previousChord: readonly noteAllAccidentalOctave[],
        nextChord: readonly noteAllAccidentalOctave[]): IMelodyGenerator
}

export abstract class MelodyGeneratorBase   {
   
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


export function melodyGenerator(
    progression: IProgression, 
    melodyPattern: IMelodyGeneratorBase): IMelodicPattern {
    const melody = progression.chords.map((chord, index) => new melodyPattern(chord, progression.chords[index - 1], progression.chords[index + 1]).melody())
    return {
        timeSignature: 4,
        melodyNotes: melody.flat(),
        bass: progression.bass
    }
}


