
import { Scale } from "@tonaljs/tonal";
import { TKeyInfo } from "../keyInfo";
import { IProgression } from "../transposition";
import { EIntervalDistance, note_transpose, TNoteAllAccidental, TNoteAllAccidentalOctave, transpose_to_key } from "../utils";
import { LogError } from "../dev-utils";
import { TSyllable, remove_octave, syllables_in_key_of_c } from "../solfege";
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
    conditions: (((solfegePatterns: ISolfegePattern["patterns"]) => boolean) | (() => boolean))[],
    returnValue: { duration: 1 | 2 | 3 | 4 }[]
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

export abstract class MelodyGeneratorBase {

    protected currentChordNotes: ChordNotes;
    protected previousTopNote: TNoteAllAccidentalOctave | undefined

    constructor(
        private currentChord: readonly TNoteAllAccidentalOctave[],
        protected previousChord: readonly IMelodyFragment[] | undefined,
        protected nextChord: readonly TNoteAllAccidentalOctave[] | undefined,
        protected keyInfo: TKeyInfo
    ) {
        this.currentChordNotes = new ChordNotes(this.currentChord);
        this.previousTopNote = this.previousChord?.at(-1)?.note.at(-1)

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

    private range_octave_above_and_below(minorVariant: TMinorVariant, note: TNoteAllAccidentalOctave) {
        let range = Scale.rangeOf(this.key_scale(minorVariant))(note_transpose(note, EIntervalDistance.OctaveUp), note_transpose(note, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];
        return range;
    }

    private key_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.get_minor_scales(minorVariant)
        } else {
            scale = this.keyInfo.scale
        }
        return scale as TNoteAllAccidental[];
    }

    private scale_note_from_range(note: TNoteAllAccidentalOctave, index: number, minorVariant: "natural" | "harmonic" | "melodic") {
        const range = this.range_octave_above_and_below(minorVariant, note)
        const noteIndex = range.findIndex(n => n === note)
        if (noteIndex === -1) {
            throw new Error("scale note not found")
        }
        return range.at(noteIndex + index) as TNoteAllAccidentalOctave
    }

    private solfege_syllable(note: TNoteAllAccidentalOctave) {
        const transposedNote = transpose_to_key(note, this.keyInfo.tonic as TNoteAllAccidental);
        return syllables_in_key_of_c[remove_octave(transposedNote)] as TSyllable;
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
                    melody = patternObj.returnValue.map((r, index) => {
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
        timeSignature: 4, // refactor and include different time signatures
        melodyNotes: melodies.flat(),
        bass: progression.bass
    }
}
