
import { TKeyInfo } from "../keyInfo";
import { IProgression } from "../transposition";
import { get_interval_integer, TNoteAllAccidentalOctave } from "../utils";

export interface IMelodicPattern {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly TNoteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: TNoteAllAccidentalOctave[],
    duration: 1 | 2 | 3 | 4
}

interface IMelodyGenerator {
    melody():  IMelodyFragment[]
}

export interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(currentChord: readonly TNoteAllAccidentalOctave[],
        previousChord: readonly TNoteAllAccidentalOctave[],
        nextChord: readonly TNoteAllAccidentalOctave[],
        keyInfo : TKeyInfo
        ): IMelodyGenerator
}

export abstract class MelodyGeneratorBase   {
   
    protected topNote;
    protected secondNote;
    protected thirdNote;
    protected fourthNote;
    constructor (
       protected currentChord: readonly TNoteAllAccidentalOctave[],
       protected previousChord: readonly TNoteAllAccidentalOctave[],
       protected nextChord: readonly TNoteAllAccidentalOctave[],
       protected keyInfo: TKeyInfo

    )  {
        const topNote = this.currentChord.at(-1);
        this.topNote = topNote as TNoteAllAccidentalOctave;
        this.secondNote = currentChord.at(-2) as TNoteAllAccidentalOctave;
        this.thirdNote = currentChord.at(-3) as TNoteAllAccidentalOctave;
        this.fourthNote = currentChord.at(-4) as TNoteAllAccidentalOctave | undefined;
    };
    abstract  melody():  IMelodyFragment[];
  }


export function melodyGenerator(
    progression: IProgression, 
    melodyPattern: IMelodyGeneratorBase,
    keyInfo: TKeyInfo 
    ): IMelodicPattern {
    const melody = progression.chords.map(
        (chord, index) => new melodyPattern(
            chord, 
            progression.chords[index - 1], 
            progression.chords[index + 1],
            keyInfo
        ).melody())
    return {
        timeSignature: 4,
        melodyNotes: melody.flat(),
        bass: progression.bass
    }
}


