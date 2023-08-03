

import { interval_direction, interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_integer_absolute } from "../utils";
import { NoVoiceLeadning } from "./globalConditions";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGeneratorBase";

export const MelodyTopSingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_top_singulate";
    static description = "Soprano";
    static override globalConditions = NoVoiceLeadning;
    public melody() {
        return [{ isFallback : false, melody :[
            { note: [this.chordNotes.Soprano], duration: 4 as const }
        ]}]
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

        return [{ isFallback : false , melody : [
            { note: chord, duration: 4 as const }

        ]}]
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
                    description: "Alto-PT-Soprano (M3/m3)-Major",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-PT-Soprano (M3/m3)-Minor",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3
                    ],
                    isCadence : false,
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : true,
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
                    isFallback : true,
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
                    isFallback : true,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : false,

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
                    isFallback : false,
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
                    isFallback : false,
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
                    isFallback : true,
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
                    isFallback : true,
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
                    isFallback : true,
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

        const nextSopranoNote = this.nextChord?.last();
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
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
                {
                    description: "Soprano-Alto (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(sopranoNote, altoNote) === 3,
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                 {
                    description: "Alto-Soprano (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(sopranoNote, altoNote) === 3,
                    ],
                    isCadence : false,
                    isFallback : false,
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
                    isFallback : true,
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
                    isFallback : true,
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
                    isFallback : true,
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
                    isFallback : false,

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
                    isFallback : false,
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
                    isFallback : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                }

            ]);
    }
}

export const MelodyPattern_004: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_004";
    static description = "Stepwise";
    
    public melody() {

        const sopranoNote = this.chordNotes.Soprano
        const altoNote = this.chordNotes.Alto;
        const tenorNote = this.chordNotes.Tenor;

        const nextSopranoNote = this.nextChord?.last();
        const nextAltoNote = this.nextChord?.at(-2);
        const previousMelody = this.previousMelody
        const key = this.keyInfo.type;
        const index = this.index;
        const totalIndex = this.totalIndex;
        const previousNote = previousMelody?.last()?.note.last()

        const isSecond = (note1: TNoteAllAccidentalOctave, note2: TNoteAllAccidentalOctave) => 
            interval_distance(note1, note2) === "2M" || 
            interval_distance(note1, note2) === "-2M" || 
            interval_distance(note1, note2) === "2m" ||
            interval_distance(note1, note2) === "-2m";

            
        
  
        return this.pattern_executor(
            [
                {
                    description: "Alto-PT-Soprano (M3/m3)-Major",
                    conditions: [
                        () => key === "major",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                        
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Alto-PT-Soprano (M3/m3)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                        
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Soprano-PT-Alto (M3/m3)-Major",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Soprano-PT-Alto (M3/m3)-Minor",
                    conditions: [
                        () => interval_integer_absolute(altoNote, sopranoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Alto-(PT-above)-(PT-below)-Soprano-Major",
                    conditions: [
                        () => key === "major",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Alto-(PT-above)-(PT-below)-Soprano-Minor",
                    conditions: [
                        () => key === "minor",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Soprano-(PT-below)-(PT-above)-Alto-Major",
                    conditions: [
                        () => key === "major",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Soprano-(PT-below)-(PT-above)-Alto-Minor",
                    conditions: [
                        () => key === "minor",
                        () => interval_integer_absolute(altoNote, sopranoNote) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Tenor-PT-Alto-Major (M3/m3)",
                    conditions: [
                        () => key === "major",
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(tenorNote!, altoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, tenorNote!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Tenor-PT-Alto-Minor (M3/m3)",
                    conditions: [
                        () => key === "minor",
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(tenorNote!, altoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, tenorNote!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Alto-PT-Tenor (M3/m3)-Major",
                    conditions: [
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(tenorNote!, altoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },
                {
                    description: "Alto-PT-Tenor (M3/m3)-Minor",
                    conditions: [
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(tenorNote!, altoNote) === 3,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 1 },
                        { duration: 1 },
                    ],
                },               
               
                {
                    description: "Alto-(PT-below)-(PT-above)-Tenor-Major",
                    conditions: [
                        () => key === "major",
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(altoNote, tenorNote!) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Alto-(PT-below)-(PT-above)-Tenor-Minor",
                    conditions: [
                        () => key === "minor",
                        () => tenorNote !== undefined,
                        () => interval_integer_absolute(altoNote, tenorNote!) === 4,
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 1 },

                    ],
                },
                {
                    description: "Soprano-(PT-below)-Major",
                    conditions: [
                        () => key === "major",
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-(PT-above)-Major",
                    conditions: [
                        () => key === "major",
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-below)-Major",
                    conditions: [
                        () => key === "major",
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-above)-Major",
                    conditions: [
                        () => key === "major",
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-above)-Alto-Major",
                    conditions: [
                        () => key === "major",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Alto-Major",
                    conditions: [
                        () => key === "major",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-above)-Alto-Minor",
                    conditions: [
                        () => key === "minor",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Alto-Minor",
                    conditions: [
                        () => key === "minor",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-above)-Soprano-Major",
                    conditions: [
                        () => key === "major",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Soprano-Major",
                    conditions: [
                        () => key === "major",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-above)-Soprano-Minor",
                    conditions: [
                        () => key === "minor",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Soprano-Minor",
                    conditions: [
                        () => key === "minor",
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-(PT-below)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-(PT-above)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => previousNote === undefined ? true : isSecond(previousNote, sopranoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },   
                {
                    description: "Alto-(PT-below)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(PT-above)-Minor",
                    conditions: [
                        () => key === "minor",
                        () => previousNote === undefined ? true : isSecond(previousNote, altoNote)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                }, 
                {
                    description: "(PT-above)-Tenor-Major",
                    conditions: [
                        () => key === "major",
                        () => tenorNote !== undefined,
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote,  pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Tenor-Major",
                    conditions: [
                        () => key === "major",
                        () => tenorNote !== undefined,
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-above)-Tenor-Minor",
                    conditions: [
                        () => key === "minor",
                        () => tenorNote !== undefined,
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "(PT-below)-Tenor-Minor",
                    conditions: [
                        () => key === "minor",
                        () => tenorNote !== undefined,
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : false,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Soprano-(NT-below)-Soprano",
                    conditions: [
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : true,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Alto-(NT-below)-Alto",
                    conditions: [
                        (pattern) => previousNote === undefined ? true : isSecond(previousNote, pattern?.first()!)
                    ],
                    isCadence : false,
                    isFallback : true,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },         
               
                {
                    description: "CadenceSoprano",
                    conditions: [
                        () => isSecond(previousNote!, sopranoNote)
                    ],
                    isCadence : true,
                    isFallback : false,

                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "CadenceAlto",
                    conditions: [
                        () => isSecond(previousNote!, altoNote)
                    ],
                    isCadence : true,
                    isFallback : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "CadenceTenor",
                    conditions: [
                        () => tenorNote !== undefined && isSecond(previousNote!, tenorNote)
                    ],
                    isCadence : true,
                    isFallback : false,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "PT-Above-Soprano",
                    conditions: [
                        (pattern) => isSecond(previousNote!, pattern?.first()!)
                    ],
                    isCadence : true,
                    isFallback : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
               
                {
                    description: "PT-Above-Alto",
                    conditions: [
                        (pattern) => isSecond(previousNote!, pattern?.first()!)
                    ],
                    isCadence : true,
                    isFallback : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                },
     
                {
                    description: "PT-Above-Tenor",
                    conditions: [
                        (pattern) => isSecond(previousNote!, pattern?.first()!)
                    ],
                    isCadence : true,
                    isFallback : true,
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 }
                    ],
                }
            ]);
    }
}




