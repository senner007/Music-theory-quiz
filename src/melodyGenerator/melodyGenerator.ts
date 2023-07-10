import { TKeyInfo } from "../keyinfo/keyInfo";
import { IProgression } from "../transposition";
import { EIntervalDistance, TIntervalInteger, TNoteAllAccidental, TNoteAllAccidentalOctave, transpose_to_key } from "../utils";
import { LogError } from "../dev-utils";
import { remove_octave, syllables_in_key_of_c } from "../solfege";
import { ISolfegePattern, solfegePatterns } from "./solfegePatterns";
import { TChord } from "../quiz/audiateHarmony";
import {  note } from "@tonaljs/tonal";
import { Conditions, GlobalConditions } from "./patternConditions";
import { note_transpose, scale_range } from "../tonal-interface";

export interface IMelodicPattern {
    readonly timeSignature: 2 | 3 | 4
    readonly melodyNotes: IMelodyFragment[]
    readonly bass: readonly TNoteAllAccidentalOctave[];
}

export interface IMelodyFragment {
    note: TNoteAllAccidentalOctave[],
    duration: 1 |  2 | 3 | 4
}

type TMinorVariant = "natural" | "harmonic" | "melodic"

interface IMelodyGenerator {
    melody(): IMelodyFragment[]
    chordFunction: ChordFunction;
    bassNote : TNoteAllAccidentalOctave;
}

export interface IMelodyGeneratorBase {
    id: string;
    description: string
    new(options : IMelodyOptions): IMelodyGenerator
}

export interface IPattern {
    description: typeof solfegePatterns[number]["description"],
    conditions: (((solfegePatterns: TNoteAllAccidentalOctave[] | undefined) => boolean) | (() => boolean))[],
    isCadence : boolean;
    rhythm: { duration: 1 | 2 | 3 | 4 }[]
}

export interface IPatternCadence {
    description: "cadence",
    returnValue: () => IMelodyFragment[]
}

class ChordNotes {

    public Soprano;
    public Alto;
    public Tenor;
    public fourth;
    public all : TNoteAllAccidentalOctave[];
    constructor(private chord: readonly TNoteAllAccidentalOctave[]) {

        this.Soprano = chord.at(-1) as TNoteAllAccidentalOctave;
        this.Alto = chord.at(-2) as TNoteAllAccidentalOctave;
        this.Tenor = chord.at(-3) as TNoteAllAccidentalOctave | undefined;
        this.fourth = chord.at(-4) as TNoteAllAccidentalOctave | undefined;
        this.all = chord;
        if (chord.length > 4) {
            LogError("More than 4 chord notes")
        }
    }
}

export class ChordFunction {

    constructor(private chord: TChord, private key : TNoteAllAccidental) {

    }

    public get isMajor() : boolean {
        return this.chord.quality === "Major"
    }

    public get isDominant() : boolean {
        return note_transpose(this.chord.tonic as TNoteAllAccidental, "4P") === this.key || this.isDominantSeventh || this.isSecondaryDominant
        // TODO the fifth is not always major
    }

    public get isDominantSeventh() : boolean {
        return this.chord.aliases.includes("dom")
    }

    public get isSecondaryDominant() : boolean {
        return this.chord.aliases.includes("secDom")
    }
    
    public get tonic() {
        return this.chord.tonic as TNoteAllAccidental
    }

    public get third() {
        const indexOfThirdInterval = this.chord.intervals.findIndex(i => i === "3M" || i === "3m")
        if (indexOfThirdInterval !== -1) {
            return this.chord.notes.at(indexOfThirdInterval)
        }
        return undefined
    }

    public get seventh(): TNoteAllAccidental | undefined {

        const indexOfSeventhInterval = this.chord.intervals.findIndex(i => i === "7M" || i === "7m")
        if (indexOfSeventhInterval !== -1) {

            return this.chord.notes.at(indexOfSeventhInterval)
        }
        return undefined
    }

    public get leadingNote() : TNoteAllAccidental | undefined {
        return this.isDominant === true ? note_transpose(this.tonic, "3M") : undefined
    }
}


export abstract class MelodyGeneratorBase implements IMelodyGenerator {

    public chordNotes: ChordNotes;
    public chordFunction : ChordFunction
    public conditions;
    public bassNote; 
    private previousGenerator;
    public keyInfo;
    private nextChordFunction: ChordFunction | undefined;
    private previousMelody;
    public nextChord;
    
    constructor(IMelodyOptions : IMelodyOptions) {

        this.chordNotes = new ChordNotes(IMelodyOptions.currentChord);
        this.chordFunction = new ChordFunction(IMelodyOptions.currentChordFunction, IMelodyOptions.keyInfo.tonic as TNoteAllAccidental);
        this.previousGenerator = IMelodyOptions.previousGenerator;
        
        this.keyInfo = IMelodyOptions.keyInfo
        this.bassNote = IMelodyOptions.bass;
        this.nextChordFunction =  IMelodyOptions.nextChordFunction ? new ChordFunction(IMelodyOptions.nextChordFunction, this.keyInfo.tonic as TNoteAllAccidental) : undefined
        this.previousMelody = IMelodyOptions.previousMelody
        this.conditions = new Conditions(
            this.chordFunction, 
            this.previousGenerator?.chordFunction, 
            this.previousMelody, 
            this.keyInfo, 
            this.nextChordFunction
            );
        
        this.nextChord = IMelodyOptions.nextChord;
    };

    
    abstract globalConditions : typeof GlobalConditions

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

    private correct_scale_to_fit_non_diatonic_chord(scale: readonly TNoteAllAccidental[]) {
        return scale.map(n => { 
            const noteFromChord = this.chordNotes.all.find(c => {
                return note(c).letter ===  note(n).letter
            })
            if (noteFromChord && remove_octave(noteFromChord) !== n) {
                return remove_octave(noteFromChord)
            } 
            return n;
        });
    }

    private key_scale(minorVariant: TMinorVariant): readonly TNoteAllAccidental[] {
        let scale : readonly TNoteAllAccidental[];
        if (this.keyInfo.type === "minor") {
            scale = this.minor_variant(minorVariant)
        } else {
            scale = this.keyInfo.keyInfo.scale
        }

        scale = this.correct_scale_to_fit_non_diatonic_chord(scale);
       
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
        patternObjs: readonly [...IPattern[]],
        fallback: () => IMelodyFragment[],
    ) {

        const globalConditions = new this.globalConditions(
            this.chordFunction,
            this.previousGenerator?.chordFunction,
            this.previousMelody,
            this.keyInfo,
            this.nextChordFunction,
            this.previousGenerator?.bassNote,
            this.bassNote
        ) 

        let melody;
        for (const patternObj of patternObjs) {
            if (melody) {
                break;
            }

            if (patternObj.isCadence !== this.conditions.isCadence) {
                continue;
            }

            const solfegePattern = solfegePatterns.filter(p => p.description === patternObj.description).first_and_only();
           
            const notesMinorVariants = (["natural", "harmonic", "melodic"] as TMinorVariant[])
                .map(v => {
                    return solfegePattern.indexes.map(i => {
                        try {
                            return this.scale_note_from_range(this.chordNotes.all.at(i.index)!, i.step, v)!
                        } catch (error) {
                            return "*";
                        }
                    })
                })
                .filter(v => !v.includes("*")) as TNoteAllAccidentalOctave[][]

            for (const pattern of solfegePattern.patterns) {

                const patternMatch = notesMinorVariants.find(v => {
                    const variantSolfege = v.map(n => this.solfege_syllable(n))
                    return variantSolfege.toString() === pattern.toString();
                })

                const allConditionsMet = patternObj.conditions.every(condition => condition(patternMatch));
                const globalConditionsMet = globalConditions.globalConditionsCheck(patternMatch)

                if (!allConditionsMet || !globalConditionsMet) {
                    continue;
                }

                if (patternMatch) {
                    melody = patternObj.rhythm.map((r, index) => {
                        return { note: [patternMatch[index]], duration: r.duration }
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


interface IMelodyOptions {
    currentChordFunction: TChord,
    currentChord: readonly TNoteAllAccidentalOctave[],
    keyInfo: TKeyInfo,
    index : number,
    bass : TNoteAllAccidentalOctave;
    previousGenerator : Omit<IMelodyGenerator, "melody"> | undefined;
    previousMelody: IMelodyFragment[] | undefined;
    nextChordFunction : TChord | undefined;
    nextChord : readonly TNoteAllAccidentalOctave[];
}

export function melodyGenerator(
    progression: IProgression,
    melodyPattern: IMelodyGeneratorBase,
    chords : TChord[],
    keyInfo: TKeyInfo
): IMelodicPattern {

    const generators : IMelodyGenerator[] = [];
    const melodies : IMelodyFragment[][] = []
    progression.chords.forEach(
        (chordNotes, index) => {

            const args : IMelodyOptions = {
                currentChordFunction : chords[index],
                currentChord : chordNotes,
                keyInfo: keyInfo,
                index : index,
                bass : progression.bass[index],
                previousGenerator : generators.at(-1),
                previousMelody : melodies.at(-1),
                nextChordFunction : chords[index +1],
                nextChord : progression.chords[index +1]
            }

            const generator = new melodyPattern(args)
            const melody = generator.melody();
            melodies.push(melody)
            generators.push(generator)
        })
    return {
        timeSignature: 4, // refactor and include different time signatures
        melodyNotes: melodies.flat(),
        bass: progression.bass
    }
}
