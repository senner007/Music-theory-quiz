
import { Note, Scale } from "@tonaljs/tonal";
import { TKeyInfo } from "../keyInfo";
import { IProgression } from "../transposition";
import { EIntervalDistance, get_interval_integer, note_transpose, TNoteAllAccidental, TNoteAllAccidentalOctave, transpose_to_key, ObjectKeys } from "../utils";
import { LogError } from "../dev-utils";
import { TSolfegeDict, TSyllable, remove_octave, syllables_in_key_of_c } from "../solfege";
import { ISolfegePattern, solfegePatterns } from "./solfegePatterns";

export interface IMelodicPattern {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly TNoteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: TNoteAllAccidentalOctave[],
    duration: 1 | 2 | 3 | 4
}

type TMinorVariant = "natural" | "harmonic" | "melodic"

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

export interface IPattern {
    description: typeof solfegePatterns[number]["description"],
    conditions: (((pattern: TSyllable[]) => boolean) |  (() => boolean)) [],
    returnValue: {duration : 1 | 2 | 3 | 4}[]
}

export interface IPatternCadence {
    description: "cadence",
    isFinal : () => boolean,
    returnValue: () => IMelodyFragment[]
}

class ChordNotes {

    public top;
    public second;
    public third;
    public fourth;
    // public total : (TNoteAllAccidentalOctave | undefined)[]
    constructor(private chord: readonly TNoteAllAccidentalOctave[]) {

        this.top = chord.at(-1) as TNoteAllAccidentalOctave;
        this.second = chord.at(-2) as TNoteAllAccidentalOctave;
        this.third = chord.at(-3) as TNoteAllAccidentalOctave | undefined;
        this.fourth = chord.at(-4) as TNoteAllAccidentalOctave | undefined;
        // this.total = chord
        if (chord.length > 4) {
            LogError("More than 4 chord notes - refactor")
        }
    }
    get intervalTopSecond() {
        return Math.abs(get_interval_integer(this.top, this.second));
    }

}

export abstract class MelodyGeneratorBase {

    protected currentChordNotes: ChordNotes

    constructor(
        private currentChord: readonly TNoteAllAccidentalOctave[],
        protected previousChord: readonly IMelodyFragment[] | undefined,
        protected nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        protected keyInfo: TKeyInfo
    ) {
        this.currentChordNotes = new ChordNotes(this.currentChord);

    };

    private get_minor_scales(minorVariant: "natural" | "harmonic" | "melodic"): string[] {
        if (this.keyInfo.type !== "minor") {
            LogError("Not minor scale error")
        }
        let obj = {
            natural: this.keyInfo.natural.scale,
            harmonic: this.keyInfo.harmonic.scale,
            melodic: this.keyInfo.melodic.scale
        } as const;
        return obj[minorVariant]

    }

    private get_range(minorVariant: TMinorVariant) {
        let range = Scale.rangeOf(this.get_scale(minorVariant))(note_transpose(this.currentChordNotes.top, EIntervalDistance.OctaveUp), note_transpose(this.currentChordNotes.top, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];
        return range;
    }

    private get_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.get_minor_scales(minorVariant)
        } else {
            scale = this.keyInfo.scale
        }
        return scale as TNoteAllAccidental[];
    }

    scale_note_from(note: TNoteAllAccidentalOctave, index: number, minorVariant: "natural" | "harmonic" | "melodic") {
        const range = this.get_range(minorVariant)
        const noteIndex = range.findIndex((n, index) => n === note)
        if (noteIndex === -1) {
            throw new Error("scale note not found")
        }
        return range.at(noteIndex + index) as TNoteAllAccidentalOctave
    }

    solfege_syllable(note: TNoteAllAccidentalOctave) {
        const transposedNote = transpose_to_key(note, this.keyInfo.tonic as TNoteAllAccidental);
        return syllables_in_key_of_c[remove_octave(transposedNote)] as TSyllable;
    }


    pattern_executor(
        patternObjs: readonly [...IPattern[], IPatternCadence],
        fallback : () => IMelodyFragment[],
    ) {
        const cadence = patternObjs.filter(p => p.description === "cadence").first_and_only() as IPatternCadence
        if (cadence.isFinal()) {
            return cadence.returnValue();
        }

        let melody;
        for(const patternObj of patternObjs.filter(p => p.description !== "cadence") as IPattern[]) {
            const patterns = solfegePatterns.filter(p => p.description === patternObj.description).first_and_only();
           
            if (melody) {
                break;
            }

            const notesVariuants = (["natural", "harmonic", "melodic"] as TMinorVariant[]).map(v => {
                return patterns.indexes.map(i => {
                    try {
                        return this.scale_note_from(this.currentChord.at(i.index)!, i.step, v)!
                    } catch (error) {
                        return "";
                    }
                })
            })

            for (const pattern of patterns.patterns) {
                const allConditionsMet = patternObj.conditions.every(condition => condition(pattern))
                let notesPatternMatch;
                let notes: TNoteAllAccidentalOctave[];
                for (const minorVariant of notesVariuants) {
                    notesPatternMatch = minorVariant.map(n => n !== "" ? this.solfege_syllable(n) : "").toString() === pattern.toString()
                    
                    if (notesPatternMatch){
                        notes = minorVariant as TNoteAllAccidentalOctave[];
                        break;
                    } 
                }

                if (allConditionsMet && notesPatternMatch) {
                    melody = patternObj.returnValue.map((r, index) => {
                        return { note: [notes[index]], duration : r.duration}
                    })
                    break;
                }
            }
        }

        if (melody) {
            return melody
        }

        return fallback();;
    }



    abstract melody(): IMelodyFragment[];
}


export function melodyGenerator(
    progression: IProgression,
    melodyPattern: IMelodyGeneratorBase,
    keyInfo: TKeyInfo
): IMelodicPattern {

    const melodies: IMelodyFragment[][] = []
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


