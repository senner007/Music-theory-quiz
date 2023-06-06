import { Interval } from "@tonaljs/tonal";
import { IProgression } from "./transposition";
import { getIntervalDistance, getIntervalInteger, intervalToAbsolute, noteAllAccidentalOctave } from "./utils";

export interface IMelody {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly noteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: noteAllAccidentalOctave[],
    duration: 1 | 2 | 3 | 4
}

type MelodyGenerator = (
    currentChord: readonly noteAllAccidentalOctave[],
    previousChord: readonly noteAllAccidentalOctave[],
    nextChord: readonly noteAllAccidentalOctave[]
) => IMelodyFragment[]


export function melodyGenerator(progression: IProgression, melodyGenerator: MelodyGenerator): IMelody {
    const melody = progression.chords.map((chord, index) => melodyGenerator(chord, progression.chords[index - 1], progression.chords[index + 1]))
    return {
        timeSignature: 4,
        melodyNotes: melody.flat(),
        bass: progression.bass
    }
}


// export function melodySingulate(
//     currentChord: readonly noteAllAccidentalOctave[], 
//     previousChord: readonly noteAllAccidentalOctave[], 
//     nextChord: readonly noteAllAccidentalOctave[]
//     ): IMelodyFragment[] {

//     const topNote = currentChord.at(-1);
//     if (topNote === undefined) {
//         throw new Error();
//     }
//     return { note: [topNote], duration: 4 }
// }

export function melodyPattern(
    currentChord: readonly noteAllAccidentalOctave[], 
    previousChord: readonly noteAllAccidentalOctave[], 
    nextChord: readonly noteAllAccidentalOctave[]
    ): IMelodyFragment[] {

  
    const topNote = currentChord.at(-1);
    const secondNote = currentChord.at(-2);

    if (topNote === undefined || secondNote === undefined) {
        throw new Error();
    }

    const intervalInteger = Math.abs(getIntervalInteger(topNote, secondNote));

    if (intervalInteger === 3) {
        return [
            { note: [topNote], duration: 2 },
            { note: [secondNote], duration: 2 }
        ]
    } else {
        return [
            { note: [topNote], duration: 4 }
        ]
    }
    
}