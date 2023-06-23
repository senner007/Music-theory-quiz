
import { get_interval_integer } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "singular";
    static description = "1st (.)";
    public melody() {
        return [
            { note: [this.currentChordNotes.top], duration: 4 as const }
        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_001";
    static description = "2nd-3rd (M3/m3), 3rd-2nd (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second
        const thirdNote = this.currentChordNotes.third

        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)

        return this.pattern_executor(
            [
                {
                    description: "2nd-3rd (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () =>  Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 2 }, // type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "3rd-2nd (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === thirdNote),
                        () =>  Math.random() <= 0.5,
                    ],
                    returnValue:  [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
                    isFinal : () => !this.nextChord,
                    returnValue: () => [
                        { note: [secondNote], duration: 4 },
                    ]
                },
               
               
            ] as const,
            () => {
                return [
                    { note: [secondNote], duration: 4 as const },
                ]
            });
    }
}


export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_002";
    static description = "2nd-1st (M3/m3), 1st-(NT-below)-1st (.)";
    public melody() {

        // const range = Scale.rangeOf(this.scale)(this.currentChordNotes.top, note_transpose(this.currentChordNotes.top, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];
        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second

        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)

        return this.pattern_executor(
            [
                {
                    description: "1st-2nd (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === topNote),
                        () =>  Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 2 }, // type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "2nd-1st (M3/m3)",
                    conditions: [
                        () =>  Math.random() <= 0.5,
                        () => !(previousTopNote === secondNote)
                    ],
                    returnValue:  [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
                    isFinal : () => !this.nextChord,
                    returnValue: () => [
                        { note: [topNote], duration: 4 },
                    ]
                },
               
               
            ] as const,
            () => {
                return [
                    { note: [topNote], duration: 4 as const },
                ]
            });
    }
}

export const MelodyPattern_003: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_003";
    static description = "2nd-1st (M3/m3), 1st-(NT-above)-1st-(NT-below) (.)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second

        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)


        return this.pattern_executor(
            [
                {
                    description: "2nd-PT-1st (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () =>  Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "1st-PT-2nd (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === topNote)
                    ],
                    returnValue:  [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
                    isFinal : () => !this.nextChord,
                    returnValue: () => [
                        { note: [topNote], duration: 4 },
                    ]
                },
               
               
            ] as const,
            () => {
                return [
                    { note: [secondNote], duration: 2 as const },
                    { note: [topNote], duration: 2 as const },
                ]
            });

    }
}

export const MelodyPattern_004: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_004";
    static description = "1st-2nd (M3/m3), 3rd-PT-2st (.)";
    public melody() {

        const topNote = this.currentChordNotes.top;
        const secondNote = this.currentChordNotes.second;
        const thirdNote = this.currentChordNotes.third;

        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)

        return this.pattern_executor(
            [
                {
                    description: "2nd-(NT-below)-2nd",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () => !thirdNote || get_interval_integer(secondNote, thirdNote) !== 3,
                        () =>  Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "3rd-PT-2nd (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === thirdNote)
                    ],
                    returnValue:  [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
                    isFinal : () => !this.nextChord,
                    returnValue: () => [
                        { note: [topNote], duration: 4 },
                    ]
                },
               
               
            ] as const,
            () => {
                return [
                    { note: [topNote], duration: 2 as const },
                    { note: [secondNote], duration: 2 as const },
                ]
            });

    }
}