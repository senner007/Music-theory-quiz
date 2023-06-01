import { IProgression } from "./transposition";
import { noteAllAccidentalOctave } from "./utils";

export interface IMelody {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly noteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: noteAllAccidentalOctave,
    duration: 1 | 2 | 3 | 4
}

type MelodyGenerator = (
    currentChord: readonly noteAllAccidentalOctave[],
    previousChord: readonly noteAllAccidentalOctave[],
    nextChord: readonly noteAllAccidentalOctave[]
) => IMelodyFragment


export function melodyGenerator(progression: IProgression, melodyGenerator: MelodyGenerator): IMelody {
    const melody = progression.chords.map((chord, index) => melodyGenerator(chord, progression.chords[index - 1], progression.chords[index + 1]))
    return {
        timeSignature: 4,
        melodyNotes: melody,
        bass: progression.bass
    }
}


export function melodySingulate(
    currentChord: readonly noteAllAccidentalOctave[], 
    previousChord: readonly noteAllAccidentalOctave[], 
    nextChord: readonly noteAllAccidentalOctave[]
    ): IMelodyFragment {

    const lastNote = currentChord.at(-1);
    if (lastNote === undefined) {
        throw new Error();
    }
    return { note: lastNote, duration: 4 }
}