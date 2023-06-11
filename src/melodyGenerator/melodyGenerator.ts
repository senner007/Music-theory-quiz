
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
    melody(): IMelodyFragment[]
}

export interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(currentChord: readonly TNoteAllAccidentalOctave[],
        previousChord: readonly IMelodyFragment[] | undefined,
        nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        keyInfo: TKeyInfo
    ): IMelodyGenerator
}

export abstract class MelodyGeneratorBase {

    protected topNote;
    protected secondNote;
    protected thirdNote;
    protected fourthNote;
    constructor(
        protected currentChord: readonly TNoteAllAccidentalOctave[],
        protected previousChord: readonly IMelodyFragment[] | undefined,
        protected nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        protected keyInfo: TKeyInfo

    ) {
        const topNote = this.currentChord.at(-1);
        this.topNote = topNote as TNoteAllAccidentalOctave;
        this.secondNote = currentChord.at(-2) as TNoteAllAccidentalOctave;
        this.thirdNote = currentChord.at(-3) as TNoteAllAccidentalOctave;
        this.fourthNote = currentChord.at(-4) as TNoteAllAccidentalOctave | undefined;
    };
    abstract melody(): IMelodyFragment[];
}


export function melodyGenerator(
    progression: IProgression,
    melodyPattern: IMelodyGeneratorBase,
    keyInfo: TKeyInfo
): IMelodicPattern {

    const melodies : IMelodyFragment[][] = []
    progression.chords.forEach(
        (chord, index) => {

            const melody =
                new melodyPattern(
                    chord,
                    melodies.at(-1) as IMelodyFragment[] | undefined,
                    progression.chords[index + 1],
                    keyInfo
                ).melody()
            melodies.push(melody)
        })
    return {
        timeSignature: 4,
        melodyNotes: melodies.flat(),
        bass: progression.bass
    }
}


