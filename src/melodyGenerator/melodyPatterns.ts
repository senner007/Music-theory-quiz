

import { interval_direction, interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_integer_absolute } from "../utils";
import { NoVoiceLeadning } from "./globalConditions";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";

export const MelodyTopSingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_top_singulate";
    static description = "Soprano";
    static override globalConditions = NoVoiceLeadning;
    public melody() {
        return [
            { note: [this.chordNotes.Soprano], duration: 4 as const }
        ]
    }
}

export const MelodyChordal: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_chord";
    static description = "Chords";  // this only applies when returning pattern_executor
    static override globalConditions = NoVoiceLeadning;
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
                {
                    description: "FallbackSoprano",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "FallbackAlto",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "FallbackTenor",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },

            ] as const
            );
    }
}


export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_002";
    static description = "Alto voice with diatonic steps - Alto-(PT-below)/(PT-above)";
    
    public melody() {

        const altoNote = this.chordNotes.Alto;
        const nextAltoNote = this.nextChord?.at(-2);
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
                    description: "FallbackAlto",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "FallbackSoprano",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "FallbackTenor",
                    conditions: [
                        () => true,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },

            ]);
    }
}


export const MelodyPattern_003: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_003";
    static description = "Soprano-Tenor (M6/m6) Alto-Soprano (M3/m3) Soprano-Alto (M3/m3)";
    
    public melody() {

        const sopranoNote = this.chordNotes.Soprano
        const altoNote = this.chordNotes.Alto;
        const tenorNote = this.chordNotes.Tenor;

        const nextSopranoNote = this.nextChord?.at(-1);
        const nextAltoNote = this.nextChord?.at(-2);
        const previousMelody = this.previousMelody
        const key = this.keyInfo.type;
        const index = this.index;
        const totalIndex = this.totalIndex;
        
  
        return this.pattern_executor(
            [
                {
                    description: "Soprano-Tenor (M6/m6)",
                    conditions: [
                        () => tenorNote !== undefined && interval_integer_absolute(sopranoNote, tenorNote) === 6,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                 {
                    description: "Alto-Soprano (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(sopranoNote, altoNote) === 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-Alto (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(sopranoNote, altoNote) === 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "PT-Above-Soprano",
                    conditions: [
                        () => true
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                {
                    description: "PT-Above-Alto",
                    conditions: [
                        () => true
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                {
                    description: "PT-Above-Tenor",
                    conditions: [
                        () => true
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
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
                {
                    description: "PT-Above-Soprano",
                    conditions: [
                        () => true
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                {
                    description: "PT-Above-Alto",
                    conditions: [
                        () => true
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                {
                    description: "PT-Above-Tenor",
                    conditions: [
                        () => true
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },

            ]);
    }
}




