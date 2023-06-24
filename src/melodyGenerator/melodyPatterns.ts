
import { Interval } from "@tonaljs/tonal";
import { get_interval_distance, interval_direction, interval_integer_absolute } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_000";
    static description = "Top";
    public melody() {
        return [
            { note: [this.currentChordNotes.top], duration: 4 as const }
        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_001";
    static description = "Second-Third (M3/m3) Third-Second (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second
        const thirdNote = this.currentChordNotes.third

        const previousTopNote = this.previousTopNote

        return this.pattern_executor(
            [
                {
                    description: "Second-Third (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () => Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 2 }, // add type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "Third-Second (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === thirdNote),
                        () => Math.random() <= 0.5,
                    ],
                    returnValue: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
                    returnValue: () => [
                        { note: [secondNote], duration: 4 },
                    ]
                },
            ],
            () => {
                return [
                    { note: [secondNote], duration: 4 as const },
                ]
            });
    }
}


export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_002";
    static description = "1st-2nd (M3/m3), 2nd-1st (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second

        const previousTopNote = this.previousTopNote

        return this.pattern_executor(
            [
                {
                    description: "Top-Second (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === topNote),
                        () => Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 2 }, // type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-Top (M3/m3)",
                    conditions: [
                        () => Math.random() <= 0.5,
                        () => !(previousTopNote === secondNote)
                    ],
                    returnValue: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
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
    static description = "Second-PT-Top (M3/m3), Top-PT-Second (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second

        const previousTopNote = this.previousTopNote;


        return this.pattern_executor(
            [
                {
                    description: "Second-PT-Top (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () => Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Top-PT-Second (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === topNote)
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
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
    static description = "Second-(NT-below)-Second, Third-PT-Second (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top;
        const secondNote = this.currentChordNotes.second;
        const thirdNote = this.currentChordNotes.third;

        const previousTopNote = this.previousTopNote;

        return this.pattern_executor(
            [
                {
                    description: "Second-(NT-below)-Second",
                    conditions: [
                        () => !(previousTopNote === secondNote),
                        () => !thirdNote || interval_integer_absolute(secondNote, thirdNote) !== 3,
                        () => Math.random() <= 0.5
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Third-PT-Second (M3/m3)",
                    conditions: [
                        () => !(previousTopNote === thirdNote)
                    ],
                    returnValue: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
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

export const MelodyPattern_005: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_004";
    static description = "Top-(PT-below)";
    public melody() {

        const topNote = this.currentChordNotes.top;
        const nextTopNote = this.nextChord?.at(-1)


        return this.pattern_executor(
            [
                {
                    description: "Top-(PT-below)",
                    conditions: [
                        () => nextTopNote !== undefined && interval_integer_absolute(topNote, nextTopNote) === 3,
                        () => interval_direction(get_interval_distance(topNote, nextTopNote!)) === -1
                    ],
                    returnValue: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
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