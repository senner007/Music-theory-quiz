

import { interval_direction, interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_integer_absolute } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";
import { GlobalConditions } from "./patternConditions";

export const MelodyTopSingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_top_singulate";
    static description = "Soprano";
    override globalConditions = GlobalConditions; // this only applies when returning pattern_executor
    public melody() {
        return [
            { note: [this.chordNotes.Soprano], duration: 4 as const }
        ]
    }
}

export const MelodyChordal: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_chord";
    static description = "Chords";
    override globalConditions = GlobalConditions;  // this only applies when returning pattern_executor

    public melody() {
        const chord = [
            this.chordNotes.Soprano,
            this.chordNotes.Alto,
            this.chordNotes.Tenor,
            this.chordNotes.fourth
        ].filter(c => c) as TNoteAllAccidentalOctave[]

        return [
            { note: chord, duration: 4 as const }

        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_001";
    static description = "Alto-PT-Soprano (M3/m3), Soprano-(NT-below)-Soprano";
    override globalConditions = GlobalConditions;
    
    public melody() {

        const sopranoNote = this.chordNotes.Soprano
        const altoNote = this.chordNotes.Alto;

        return this.pattern_executor(
            [
                {
                    description: "Alto-PT-Soprano (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-(NT-below)-Soprano",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) !== 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "CadenceSoprano",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "CadenceAlto",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,

                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "CadenceTenor",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 4 },
                    ],
                },

            ] as const,
            () => {
                if (this.conditions.note_same_as_previous([altoNote]) || this.conditions.pattern_includes_third([sopranoNote])) { 
                    // add check for parallels condition and choose closest - not different note
                    // refactor into global conditions
                    return [
                        { note: [sopranoNote], duration: 4 as const },
                    ]
                } 

                return [
                    { note: [altoNote], duration: 4 as const },
                ]
              
            });
    }
}


export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_002";
    static description = "Alto voice with diatonic steps - Alto-(PT-below)/(PT-above)";
    override globalConditions = GlobalConditions;
    
    public melody() {


        const altoNote = this.chordNotes.Alto;
        const nextAltoNote = this.nextChord?.at(-2)


        const key = this.keyInfo.type;

        return this.pattern_executor(
            [
                {
                    description: "Alto-(PT-below)-Major",
                    conditions: [
                        () => key === "major",
                        () => nextAltoNote !== undefined && interval_integer_absolute(altoNote, nextAltoNote) === 3,
                        () => interval_direction(interval_distance(altoNote, nextAltoNote!)) === -1
                    
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-above)-Major",
                    conditions: [
                        () => key === "major",
                        () => nextAltoNote !== undefined && interval_integer_absolute(altoNote, nextAltoNote) === 3,
                        () => interval_direction(interval_distance(altoNote, nextAltoNote!)) === 1
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-below)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => nextAltoNote !== undefined && interval_integer_absolute(altoNote, nextAltoNote) === 3,
                        () => interval_direction(interval_distance(altoNote, nextAltoNote!)) === -1
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-above)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => nextAltoNote !== undefined && interval_integer_absolute(altoNote, nextAltoNote) === 3,
                        () => interval_direction(interval_distance(altoNote, nextAltoNote!)) === 1
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "CadenceAlto",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,

                    rhythm: [
                        { duration: 4 },
                    ],
                },

            ] as const,
            () => {
                return [
                    { note: [altoNote], duration: 4 as const },
                ]
              
            });
    }
}


