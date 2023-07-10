

import { TNoteAllAccidentalOctave, interval_integer_absolute } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";
import { GlobalConditions } from "./patternConditions";

export const MelodyTopSingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_top_singulate";
    static description = "Soprano";
    override globalConditions = GlobalConditions; // this only applies when returning pattern_executor
    public melody() {
        return [
            { note: [this.chordNotes.top], duration: 4 as const }
        ]
    }
}

export const MelodyChordal: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_chord";
    static description = "Chords";
    override globalConditions = GlobalConditions;  // this only applies when returning pattern_executor

    public melody() {
        const chord = [
            this.chordNotes.top,
            this.chordNotes.second,
            this.chordNotes.third,
            this.chordNotes.fourth
        ].filter(c => c) as TNoteAllAccidentalOctave[]

        return [
            { note: chord, duration: 4 as const }

        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    
    static id = "pattern_001";
    static description = "Second-PT-Top (M3/m3), Top-(NT-below)-Top";
    override globalConditions = GlobalConditions;
    
    public melody() {

        const topNote = this.chordNotes.top
        const secondNote = this.chordNotes.second;

        return this.pattern_executor(
            [
                {
                    description: "Second-PT-Top (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(secondNote, topNote) === 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Top-(NT-below)-Top",
                    conditions: [
                        () => interval_integer_absolute(secondNote, topNote) !== 3,
                    ],
                    isCadence : false,
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Cadence01",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,
                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "Cadence02",
                    conditions: [
                        () => true,
                    ],
                    isCadence : true,

                    rhythm: [
                        { duration: 4 },
                    ],
                },
                {
                    description: "Cadence03",
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
                if (this.conditions.note_same_as_previous([secondNote]) || this.conditions.pattern_includes_third([topNote])) { 
                    // add check for parallels condition and choose closest note
                    // refactor global conditions
                    return [
                        { note: [topNote], duration: 4 as const },
                    ]
                } 

                return [
                    { note: [secondNote], duration: 4 as const },
                ]
              
            });
    }
}