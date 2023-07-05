import { TKeyInfo } from "../keyinfo/keyInfo";
import { IProgression } from "../transposition";
import { EIntervalDistance, TNoteAllAccidental, TNoteAllAccidentalOctave, transpose_to_key } from "../utils";
import { LogError } from "../dev-utils";
import { remove_octave, syllables_in_key_of_c } from "../solfege";
import { ISolfegePattern, solfegePatterns } from "./solfegePatterns";
import { interval_distance, interval_semitones, note_transpose, scale_range } from "../tonal-interface";
import { TChord } from "../quiz/audiateHarmony";
import { Note } from "@tonaljs/tonal";

export interface IMelodicPattern {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly TNoteAllAccidentalOctave[];
}

interface IMelodyFragment {
    note: TNoteAllAccidentalOctave[],
    duration: 1 |  2 | 3 | 4
}

type TMinorVariant = "natural" | "harmonic" | "melodic"

interface IMelodyGenerator {
    melody(): IMelodyFragment[]
}

export interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(
        currentChordDefinition: TChord,
        previousChordDefinition: TChord | undefined,
        currentChord: readonly TNoteAllAccidentalOctave[],
        previousChord: readonly IMelodyFragment[] | undefined,
        nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        keyInfo: TKeyInfo,
        index : number
    ): IMelodyGenerator
}

export interface IPattern {
    description: typeof solfegePatterns[number]["description"],
    conditions: (((solfegePatterns: ISolfegePattern["patterns"]) => boolean) | (() => boolean))[],
    rhythm: { duration: 1 | 2 | 3 | 4 }[]
}

export interface IPatternCadence {
    description: "cadence",
    returnValue: () => IMelodyFragment[]
}

class ChordNotes {

    public top;
    public second;
    public third;
    public fourth;
    constructor(private chord: readonly TNoteAllAccidentalOctave[]) {

        this.top = chord.at(-1) as TNoteAllAccidentalOctave;
        this.second = chord.at(-2) as TNoteAllAccidentalOctave;
        this.third = chord.at(-3) as TNoteAllAccidentalOctave | undefined;
        this.fourth = chord.at(-4) as TNoteAllAccidentalOctave | undefined;
        if (chord.length > 4) {
            LogError("More than 4 chord notes - refactor")
        }
    }
}


// Implement surrounding chord function logic to create more advanced patterns
// Resolve leading tone and dominant sevenths
// Avoid parallel fifths and octaves
class ChordFunction {


    constructor(private chord: TChord) {

    }

    protected get isDominant() : boolean {
        return this.chord.aliases.includes("dom")
    }

    protected get leadingNote() : TNoteAllAccidentalOctave | undefined {
        return note_transpose(this.chord.tonic as TNoteAllAccidentalOctave, "3M")
    }
}

export abstract class MelodyGeneratorBase {

    protected currentChordNotes: ChordNotes;
    protected previousTopNote: TNoteAllAccidentalOctave | undefined
    protected currentFunction;
    protected previousFunction;
    
    constructor(
        private currentChordDefinition: TChord,
        private previousChordDefinition: TChord | undefined,

        private currentChord: readonly TNoteAllAccidentalOctave[],
        protected previousChord: readonly IMelodyFragment[] | undefined,
        protected nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        protected keyInfo: TKeyInfo,
        protected index : number 
    ) {
        this.currentChordNotes = new ChordNotes(this.currentChord);
        this.currentFunction = new ChordFunction(this.currentChordDefinition);
        this.previousFunction = this.previousChordDefinition ? new ChordFunction(this.previousChordDefinition) : undefined
        this.previousTopNote = this.previousChord?.at(-1)?.note.at(-1)
    };

    private minor_variant(minorVariant: TMinorVariant): Readonly<TNoteAllAccidental[]> {
        if (this.keyInfo.type !== "minor") {
            LogError("Not minor scale error")
        }
        let obj = {
            natural: this.keyInfo.natural.scale as Readonly<TNoteAllAccidental[]>,
            harmonic: this.keyInfo.harmonic.scale as Readonly<TNoteAllAccidental[]>,
            melodic: this.keyInfo.melodic.scale as Readonly<TNoteAllAccidental[]>
        } as const;
        return obj[minorVariant]
    }


    private key_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.minor_variant(minorVariant)
        } else {
            scale = this.keyInfo.keyInfo.scale
        }
        return scale as Readonly<TNoteAllAccidental[]>;
    }

    private scale_note_from_range(note: TNoteAllAccidentalOctave, index: number, minorVariant: TMinorVariant) {
        const range = scale_range(this.key_scale(minorVariant), note,  EIntervalDistance.OctaveUp, EIntervalDistance.OctaveDown)
        const noteIndex = range.findIndex(n => n === note)
        if (noteIndex === -1) {
            throw new Error("scale note not found")
        }
        return range.at(noteIndex + index) as TNoteAllAccidentalOctave
    }

    private solfege_syllable(note: TNoteAllAccidentalOctave) {
        const transposedNote = transpose_to_key(note, this.keyInfo.tonic as TNoteAllAccidental);
        return syllables_in_key_of_c[remove_octave(transposedNote)];
    }


    pattern_executor(
        patternObjs: readonly [...IPattern[], IPatternCadence],
        fallback: () => IMelodyFragment[],
    ) {
        if (!this.nextChord) {
            const cadence = patternObjs.filter(p => p.description === "cadence").first_and_only() as IPatternCadence
            return cadence.returnValue();
        }

        let melody;
        for (const patternObj of patternObjs.filter(p => p.description !== "cadence") as IPattern[]) {
            if (melody) {
                break;
            }

            const solfegePattern = solfegePatterns.filter(p => p.description === patternObj.description).first_and_only();
            const allConditionsMet = patternObj.conditions.every(condition => condition(solfegePattern.patterns));

            if (!allConditionsMet) {
                continue;
            }

            const notesMinorVariants = (["natural", "harmonic", "melodic"] as TMinorVariant[]).map(v => {
                return solfegePattern.indexes.map(i => {
                    try {
                        return this.scale_note_from_range(this.currentChord.at(i.index)!, i.step, v)!
                    } catch (error) {
                        return "*";
                    }
                })
            }).filter(v => !v.includes("*")) as TNoteAllAccidentalOctave[][]

            for (const pattern of solfegePattern.patterns) {

                const notes = notesMinorVariants.find(v => {
                    const variantSolfege = v.map(n => this.solfege_syllable(n))
                    return variantSolfege.toString() === pattern.toString();
                })

                if (notes) {
                    melody = patternObj.rhythm.map((r, index) => {
                        return { note: [notes[index]], duration: r.duration }
                    })
                    break;
                }
            }
        }

        if (melody) {
            return melody
        }

        return fallback();
    }

    abstract melody(): IMelodyFragment[];
}


export function melodyGenerator(
    progression: IProgression,
    melodyPattern: IMelodyGeneratorBase,
    chords : TChord[],
    keyInfo: TKeyInfo
): IMelodicPattern {

    const melodies: IMelodyFragment[][] = []
    progression.chords.forEach(
        (chordNotes, index) => {

            const melody =
                new melodyPattern(
                    chords[index],
                    chords[index - 1],
                    chordNotes,
                    melodies.at(-1) as IMelodyFragment[] | undefined,
                    progression.chords[index + 1],
                    keyInfo,
                    index
                ).melody()
            melodies.push(melody)
        })
    return {
        timeSignature: 4, // refactor and include different time signatures
        melodyNotes: melodies.flat(),
        bass: progression.bass
    }
}
