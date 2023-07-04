
import { interval_direction, interval_distance } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_integer_absolute } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_top";
    static description = "Top";
    public melody() {
        return [
            { note: [this.currentChordNotes.top], duration: 4 as const }
        ]
    }
}

export const MelodyChordal: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_chord";
    static description = "Chord";

    public melody() {
        const chord = [
            this.currentChordNotes.top, 
                    this.currentChordNotes.second, 
                    this.currentChordNotes.third, 
                    this.currentChordNotes.fourth
        ].filter(c => c) as TNoteAllAccidentalOctave[]

        return [
            { note: chord, duration: 4 as const }

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
                    rhythm: [
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
                    rhythm: [
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
    static description = "Top-Second (M3/m3), Second-Top (M3/m3)";
    public melody() {

        const topNote = this.currentChordNotes.top
        const secondNote = this.currentChordNotes.second

        const previousTopNote = this.previousTopNote

        return this.pattern_executor(
            [
                {
                    description: "Top-Second (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(topNote, secondNote) === 3,
                        () => !(previousTopNote === topNote),
                        () => Math.random() <= 0.5
                    ],
                    rhythm: [
                        { duration: 2 }, // type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-Top (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(topNote, secondNote) === 3,
                        () => Math.random() <= 0.5,
                        () => !(previousTopNote === secondNote)
                    ],
                    rhythm: [
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
    static description = "Second-PT-Top (M3/m3), Top-PT-Second (M3/m3), Second-Top (M3/m3)";
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
                    rhythm: [
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
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-Top (M3/m3)",
                    conditions: [
                        () => interval_integer_absolute(topNote, secondNote) === 3,
                        () => !(previousTopNote === secondNote)
                    ],
                    rhythm: [
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

export const MelodyPattern_004: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_004";
    static description = "Second-(NT-below)-Second, Third-PT-Second (M3/m3), Second-Third (M3/m3)";
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
                    rhythm: [
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
                    rhythm: [
                        { duration: 1 },
                        { duration: 1 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-Third (M3/m3)",
                    conditions: [
                        () => thirdNote !== undefined && interval_integer_absolute(secondNote, thirdNote) === 3,
                        () => !(previousTopNote === secondNote),
                        () => Math.random() <= 0.5
                    ],
                    rhythm: [
                        { duration: 2 }, // add type to ensure length is equal to pattern index array length
                        { duration: 2 },
                    ],
                },
                {
                    description: "cadence",
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

export const MelodyPattern_005: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_005";
    static description = "Top-(PT-below), Top-(PT-above)";
    public melody() {

        const topNote = this.currentChordNotes.top;
        const nextTopNote = this.nextChord?.at(-1)

        return this.pattern_executor(
            [
                {
                    description: "Top-(PT-below)-Major",
                    conditions: [
                        () => this.keyInfo.type === "major",
                        () => nextTopNote !== undefined && interval_integer_absolute(topNote, nextTopNote) === 3,
                        () => interval_direction(interval_distance(topNote, nextTopNote!)) === -1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Top-(PT-above)-Major",
                    conditions: [
                        () => this.keyInfo.type === "major",
                        () => nextTopNote !== undefined && interval_integer_absolute(topNote, nextTopNote) === 3,
                        () => interval_direction(interval_distance(topNote, nextTopNote!)) === 1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Top-(PT-below)-Minor",
                    conditions: [
                        () => this.keyInfo.type === "minor",
                        () => nextTopNote !== undefined && interval_integer_absolute(topNote, nextTopNote) === 3,
                        () => interval_direction(interval_distance(topNote, nextTopNote!)) === -1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Top-(PT-above)-Minor",
                    conditions: [
                        () => this.keyInfo.type === "minor",
                        () => nextTopNote !== undefined && interval_integer_absolute(topNote, nextTopNote) === 3,
                        () => interval_direction(interval_distance(topNote, nextTopNote!)) === 1
                    ],
                    rhythm: [
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

export const MelodyPattern_006: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_006";
    static description = "Second-(PT-below), Second-(PT-above)";
    public melody() {

        const secondNote = this.currentChordNotes.second;
        const nextSecondNote = this.nextChord?.at(-2)

        return this.pattern_executor(
            [
                {
                    description: "Second-(PT-below)-Major",
                    conditions: [
                        () => this.keyInfo.type === "major",
                        () => nextSecondNote !== undefined && interval_integer_absolute(secondNote, nextSecondNote) === 3,
                        () => interval_direction(interval_distance(secondNote, nextSecondNote!)) === -1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-(PT-above)-Major",
                    conditions: [
                        () => this.keyInfo.type === "major",
                        () => nextSecondNote !== undefined && interval_integer_absolute(secondNote, nextSecondNote) === 3,
                        () => interval_direction(interval_distance(secondNote, nextSecondNote!)) === 1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-(PT-below)-Minor",
                    conditions: [
                        () => this.keyInfo.type === "minor",
                        () => nextSecondNote !== undefined && interval_integer_absolute(secondNote, nextSecondNote) === 3,
                        () => interval_direction(interval_distance(secondNote, nextSecondNote!)) === -1
                    ],
                    rhythm: [
                        { duration: 2 },
                        { duration: 2 },
                    ],
                },
                {
                    description: "Second-(PT-above)-Minor",
                    conditions: [
                        () => this.keyInfo.type === "minor",
                        () => nextSecondNote !== undefined && interval_integer_absolute(secondNote, nextSecondNote) === 3,
                        () => interval_direction(interval_distance(secondNote, nextSecondNote!)) === 1
                    ],
                    rhythm: [
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


            ] as const,
            () => {
                return [
                    { note: [secondNote], duration: 4 as const },
                ]
            });

    }
}

export const MelodyPattern_007: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_007";
    static description = "Third-Second-Top-Second, Top-Second-Third-Top, Top-Top-Second";
    public melody() {

        const topNote = this.currentChordNotes.top;

        const secondNote = this.currentChordNotes.second;
        const thirdNote = this.currentChordNotes.third;

        return this.pattern_executor(
            [
                {
                    description: "cadence",
                    returnValue: () => {
                        if (thirdNote) {
                            return [
                                { note: [], duration: 2 },
                                { note: [thirdNote, secondNote, topNote], duration: 2 },

                            ]
                        }
                        return [
                            { note: [secondNote], duration: 2 },
                            { note: [topNote], duration: 2 },
                        ]
                    }
                },


            ] as const,
            () => {
                if (!thirdNote) {
                    return [
                        { note: [topNote], duration: 2 },
                        { note: [topNote], duration: 1 },
                        { note: [secondNote], duration: 1 },
                    ]
                }
                if (this.index !== 0) {
                    return [
                        { note: [thirdNote], duration: 1 as const },
                        { note: [secondNote], duration: 1 as const },
                        { note: [topNote], duration: 1 as const },
                        { note: [secondNote], duration: 1 as const },
                    ]
                } else {
                    return [
                        { note: [topNote], duration: 1 as const },
                        { note: [secondNote], duration: 1 as const },
                        { note: [thirdNote], duration: 1 as const },
                        { note: [secondNote], duration: 1 as const },
                    ]
                }

            });

    }
}

export const MelodyPattern_008: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_008";
    static description = "Third-Second-Top, Second-Top-Second";
    public melody() {

        const topNote = this.currentChordNotes.top;

        const secondNote = this.currentChordNotes.second;
        const thirdNote = this.currentChordNotes.third;

        return this.pattern_executor(
            [
                {
                    description: "cadence",
                    returnValue: () => {
                        if (thirdNote) {
                            return [
                                { note: [], duration: 2 },
                                { note: [thirdNote, secondNote, topNote], duration: 2 },
                            ]
                        }
                        return [
                            { note: [secondNote], duration: 2 },
                            { note: [topNote], duration: 2 },
                        ]
                    }
                },


            ] as const,
            () => {
                if (!thirdNote) {
                    return [
                        { note: [], duration: 1 },
                        { note: [secondNote], duration: 1 },
                        { note: [topNote], duration: 1 },
                        { note: [secondNote], duration: 1 },

                    ]
                }
                return [
                    { note: [], duration: 1 as const },
                    { note: [thirdNote], duration: 1 as const },
                    { note: [secondNote], duration: 1 as const },
                    { note: [topNote], duration: 1 as const },
                ]

            });

    }
}