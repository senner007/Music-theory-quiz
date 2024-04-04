import { Reverse } from "../arrayProto";
import { TSyllable } from "../solfege";

export interface ISolfegePattern {
    description: string;
    indexes: readonly { index: EChordNote, step: EStep }[]
    patterns: readonly (readonly TSyllable[])[]
}

export enum EStep {
    None = 0,
    Above = -1,
    Below = 1
}

export enum EChordNote {
    Soprano = -1,
    Alto = -2,
    Tenor = -3,
    Fourth = -4
}

// This is compile checking each in "solfegePatterns_pretypecheck" extends ISolfegePattern and indexes array length equal to pattern array length
type TPatternLengthIndexesLength<T extends typeof solfegePatterns_pretypecheck[number]> =
    T extends ISolfegePattern
        ? T["patterns"][number]['length'] extends T["indexes"]['length']
            ? T["indexes"]['length'] extends T["patterns"][number]['length']
                ? true
            : `Length of ${T["indexes"]['length']} not equal to length of ${T["patterns"][number]['length']} at ${T["description"]}`
        : `Length of pattern : ${T["patterns"][number]['length']} not equal to length of indexes : ${T["indexes"]['length']} at ${T["description"]}`
    : `Not assignable to ISolfegePattern as ${T["description"]}`

// Return the "solfegePatterns_pretypecheck" type or error message
type TTypeOrError = TPatternLengthIndexesLength<typeof solfegePatterns_pretypecheck[number]> extends true ? typeof solfegePatterns_pretypecheck : TPatternLengthIndexesLength<typeof solfegePatterns_pretypecheck[number]>


function reverseSyllables<const T extends ISolfegePattern["patterns"]>(patterns: T) {
    return patterns.map(p => p.to_reverse()) as [Reverse<T[number]>]
}

const solfegePattern_001 = {
    description: "Alto-PT-Soprano (M3/m3)-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: [
        ["Do", "Re", "Mi"],
        ["Di", "Re", "Mi"],
        ["Re", "Mi", "Fa"],
        ["Re", "Mi", "Fi"],
        ["Mi", "Fa", "So"],
        ["Fa", "So", "La"],
        ["So", "La", "Ti"],
        ["So", "La", "Te"],
        ["La", "Ti", "Do"],
        ["La", "Te", "Do"],
        ["Ti", "Do", "Re"],

    ]
} as const

const solfegePattern_002 = { 
    description: "Soprano-PT-Alto (M3/m3)-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_001.patterns)
} as const

const solfegePattern_003 = {
    description: "Alto-Soprano (M3/m3)",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: [
        ["Do", "Mi"],
        ["Re", "Fa"],
        ["Re", "Fi"],
        ["Mi", "So"],
        ["Fa", "La"],
        ["So", "Ti"],
        ["La", "Do"],
        ["Ti", "Re"],

        ["Do", "Me"],
        ["Me", "So"],
        ["Fa", "Le"],
        ["Le", "Do"],

    ]
} as const


const solfegePattern_004 = {
    description: "Soprano-(NT-below)-Soprano",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: [
        ["Do", "Ti", "Do"],
        ["Re", "Do", "Re"],
        ["Mi", "Re", "Mi"],
        ["Fa", "Mi", "Fa"],
        ["Fi", "Mi", "Fi"],
        ["So", "Fa", "So"],
        ["Se", "Fa", "Se"],
        ["La", "So", "La"],
        ["Te", "La", "Te"],
        ["Ti", "La", "Ti"],

        ["Do", "Te", "Do"],
        ["Me", "Re", "Me"],
        ["Fa", "Me", "Fa"],
        ["Le", "So", "Le"],
    ]
} as const

const solfegePattern_005 = {
    description: "Alto-(NT-below)-Alto",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_004.patterns
} as const

const solfegePattern_006 = {
    description: "Soprano-Alto (M3/m3)",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const

const solfegePattern_007 = {
    description: "Tenor-PT-Alto-Major (M3/m3)",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_001.patterns
} as const

const solfegePattern_008 = {
    description: "Alto-Tenor (M3/m3)",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const

const solfegePattern_009 = {
    description: "Tenor-Alto (M3/m3)",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_003.patterns
} as const

const solfegePattern_010 = {
    description: "Soprano-(PT-below)-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below }],
    patterns: [
        // ["Do", "Ti"],
        // ["Ti", "La"],
        ["La", "So"],
        ["So", "Fa"],
        ["So", "Fi"],
        // ["Fa", "Mi"], // not the omission of the chordal seventh Fa since it should not resolve prematurely
        ["Mi", "Re"],
        ["Re", "Do"],
    ]
} as const

const solfegePattern_011 = {
    description: "Soprano-(PT-above)-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_010.patterns)
} as const

const solfegePattern_012 = {
    description: "Alto-(PT-below)-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below }],
    patterns: solfegePattern_010.patterns
} as const

const solfegePattern_013 = {
    description: "Alto-(PT-above)-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_010.patterns)
} as const

const solfegePattern_014 = {
    description: "Soprano-(PT-below)-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below }],
    patterns: [
        // ["Do", "Ti"],
        ["Do", "Te"],
        ["Te", "Le"],
        ["Le", "So"],
        ["So", "Fa"],
        ["So", "Fi"],
        // ["Fa", "Me"], // not the omission of the chordal seventh Fa since it should not resolve prematurely
        ["Me", "Re"],
        ["Re", "Do"],
    ]
} as const

const solfegePattern_015 = {
    description: "Soprano-(PT-above)-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_014.patterns).filter(s => {
        return s.toString() !== 'So,Le'
    })
} as const

const solfegePattern_016 = {
    description: "Alto-(PT-below)-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below }],
    patterns: solfegePattern_014.patterns
} as const

const solfegePattern_017 = {
    description: "Alto-(PT-above)-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_014.patterns).filter(s => {
        return s.toString() !== 'So,Le'
    })
} as const

const solfegePattern_018 = {
    description: "Alto-(PT-above)-(PT-below)-Soprano-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None }
    ],
    patterns: [
        ["Do", "Re", "Mi", "Fa"],
        ["Re", "Mi", "Fa", "So"],
        ["Mi", "Fa", "So", "La"],
        ["Fa", "So", "La", "Ti"],
        ["Fa", "So", "La", "Te"],
        ["La", "Ti", "Do", "Re"],
        ["So", "La", "Ti", "Do"],
        ["So", "La", "Ti", "Di"],
    ]
    
} as const

const solfegePattern_019 = {
    description: "Soprano-(PT-below)-(PT-above)-Alto-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }
    ],
    patterns: reverseSyllables(solfegePattern_018.patterns)
    
} as const

const solfegePattern_020 = {
    description: "CadenceSoprano",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
    ],
    patterns: [
        ["Do"],
        ["Di"],
        ["Re"],
        ["Mi"],
        ["Fa"],
        ["Fi"],
        ["So"],
        ["Si"],
        ["La"],
        ["Ti"],

        ["Me"],
        ["Le"],
        ["Te"]
    ]
    
} as const

const solfegePattern_021 = {
    description: "CadenceAlto",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const


const solfegePattern_022 = {
    description: "CadenceTenor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const

const solfegePattern_023 = {
    description: "FallbackSoprano",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const

const solfegePattern_024 = {
    description: "FallbackAlto",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const

const solfegePattern_025 = {
    description: "FallbackTenor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const

const solfegePattern_026 = {
    description: "Alto-Soprano-PT-below-Soprano",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None },
    ],
    patterns: [
        ["Do", "Mi", "Re", "Mi"],
        ["Re", "Fa", "Mi", "Fa"],
        ["Mi", "So", "Fa", "So"],
        ["Fa", "La", "So", "La"],
        ["So", "Ti", "La", "Ti"],
        ["La", "Do", "Ti", "Do"],

        ["Do", "Me", "Re", "Me"],
        ["Re", "Fa", "Me", "Fa"],
        ["Me", "So", "Fa", "So"],
        ["Fa", "Le", "So", "Le"],
        ["So", "Ti", "La", "Ti"],
        ["Le", "Do", "Te", "Do"]
    ]
    
} as const


const solfegePattern_027 = {
    description: "Soprano-Tenor (M6/m6)",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Tenor, step: EStep.None },
    
    ],
    patterns: [
        ["Do", "Mi"],
        ["Re", "Fa"],
        ["Mi", "So"],
        ["Fa", "La"],
        ["Fi", "La"],
        ["So", "Ti"],
        ["La", "Do"],
        ["Ti", "Re"],

        ["Do", "Me"],
        ["Re", "Fa"],
        ["Me", "So"],
        ["Fa", "Le"],
        ["So", "Te"],
        ["Le", "Do"],
        ["Te", "Re"],

        ["Di", "Mi"],
    ]
    
} as const

const solfegePattern_028 = {
    description: "Soprano-Soprano",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.None },
    ],
    patterns: [
        ["Do", "Do"],
        ["Re", "Re"],
        ["Mi", "Mi"],
        ["Fa", "Fa"],
        ["So", "So"],
        ["La", "La"],
        ["Ti", "Ti"],

        ["Me", "So"],
        ["Le", "Le"],
        ["Te", "Te"]
    ]
    
} as const

const solfegePattern_029 = {
    description: "PT-Above-Soprano",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.None },
    ],
    patterns: [
        ["Re", "Do"],
        ["Mi", "Re"],
        ["Fa", "Mi"],
        ["So", "Fa"],
        ["La", "So"],
        ["Ti", "La"],
        ["Do", "Ti"],

        ["Le", "So"],
        ["Fa", "Me"],
        ["Te", "Le"],
        ["Do", "Te"]
    ]
    
} as const

const solfegePattern_030 = {
    description: "PT-Above-Alto",
    indexes: [
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None },
    ],
    patterns: solfegePattern_029.patterns
    
} as const

const solfegePattern_031 = {
    description: "PT-Above-Tenor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Tenor, step: EStep.None },
    ],
    patterns: solfegePattern_029.patterns
    
} as const

const solfegePattern_032 = { 
    description: "Alto-PT-Tenor (M3/m3)-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_001.patterns)
} as const

const solfegePattern_033 = {
    description: "Alto-(PT-above)-(PT-below)-Soprano-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None }
    ],
    patterns: [
        ["Do", "Re", "Me", "Fa"],
        ["Re", "Me", "Fa", "So"],
        ["Me", "Fa", "So", "Le"],
        ["Fa", "So", "Le", "Te"],
        ["Le", "Te", "Do", "Re"],
        ["So", "La", "Ti", "Do"],
    ]
    
} as const

const solfegePattern_034 = {
    description: "Soprano-(PT-below)-(PT-above)-Alto-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }
    ],
    patterns: [
        ["Re", "Do", "Te", "Le"],
        ["Me", "Re", "Do", "Te"],
        ["Fa", "Me", "Re", "Do"],
        ["So", "Fa", "Me", "Re"],
        ["Le", "So", "Fa", "Me"],
        ["Ti", "La", "So", "Fa"],
        ["Do", "Te", "Le", "So"],
    ]
    
} as const

const solfegePattern_035 = {
    description: "Alto-(PT-below)-(PT-above)-Tenor-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Tenor, step: EStep.None }
    ],
    patterns: solfegePattern_034.patterns
    
} as const

const solfegePattern_036 = {
    description: "Alto-(PT-below)-(PT-above)-Tenor-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Tenor, step: EStep.None }
    ],
    patterns: reverseSyllables(solfegePattern_018.patterns)
    
} as const

const solfegePattern_037 = {
    description: "Alto-PT-Soprano (M3/m3)-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: [
        ["Do", "Re", "Me"],
        ["Re", "Me", "Fa"],
        ["Re", "Me", "Fi"],
        ["Me", "Fa", "So"],
        ["Fa", "So", "Le"],
        ["So", "La", "Ti"],
        ["So", "Le", "Te"],
        ["Le", "Te", "Do"],
        ["Te", "Do", "Re"],

    ]
} as const

const solfegePattern_038 = { 
    description: "Soprano-PT-Alto (M3/m3)-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.None },
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_037.patterns)
} as const

const solfegePattern_039 = { 
    description: "Alto-PT-Tenor (M3/m3)-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.None },
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_037.patterns)
} as const

const solfegePattern_040 = {
    description: "(PT-below)-Alto-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_010.patterns)
} as const

const solfegePattern_041 = {
    description: "(PT-above)-Alto-Major",
    indexes: [
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_010.patterns
} as const

const solfegePattern_042 = {
    description: "(PT-below)-Alto-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.Below },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_014.patterns)
} as const

const solfegePattern_043 = {
    description: "(PT-above)-Alto-Minor",
    indexes: [
        { index: EChordNote.Alto, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_014.patterns
} as const

const solfegePattern_044 = {
    description: "(PT-below)-Soprano-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_010.patterns)
} as const

const solfegePattern_045 = {
    description: "(PT-above)-Soprano-Major",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: solfegePattern_010.patterns
} as const

const solfegePattern_046 = {
    description: "(PT-below)-Soprano-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.Below },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_014.patterns)
} as const

const solfegePattern_047 = {
    description: "(PT-above)-Soprano-Minor",
    indexes: [
        { index: EChordNote.Soprano, step: EStep.Above },
        { index: EChordNote.Soprano, step: EStep.None }],
    patterns: solfegePattern_014.patterns
} as const

const solfegePattern_048 = {
    description: "(PT-below)-Tenor-Major",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_010.patterns)
} as const

const solfegePattern_049 = {
    description: "(PT-above)-Tenor-Major",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: solfegePattern_010.patterns
} as const

const solfegePattern_050 = {
    description: "(PT-below)-Tenor-Minor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_014.patterns)
} as const

const solfegePattern_051 = {
    description: "(PT-above)-Tenor-Minor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: solfegePattern_014.patterns
} as const

const solfegePattern_052 = {
    description: "Tenor-PT-Alto-Minor (M3/m3)",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
        { index: EChordNote.Tenor, step: EStep.Above },
        { index: EChordNote.Alto, step: EStep.None }],
    patterns: solfegePattern_037.patterns
} as const

const solfegePattern_053 = {
    description: "Tenor-(NT-below)-Tenor",
    indexes: [
        { index: EChordNote.Tenor, step: EStep.None },
        { index: EChordNote.Tenor, step: EStep.Below },
        { index: EChordNote.Tenor, step: EStep.None }],
    patterns: solfegePattern_004.patterns
} as const


const solfegePatterns_pretypecheck = [
    solfegePattern_001,
    solfegePattern_002,
    solfegePattern_003,
    solfegePattern_004,
    solfegePattern_005,
    solfegePattern_006,
    solfegePattern_007,
    solfegePattern_008,
    solfegePattern_009,
    solfegePattern_010,
    solfegePattern_011,
    solfegePattern_012,
    solfegePattern_013,
    solfegePattern_014,
    solfegePattern_015,
    solfegePattern_016,
    solfegePattern_017,
    solfegePattern_018,
    solfegePattern_019,
    solfegePattern_020,
    solfegePattern_021,
    solfegePattern_022,
    solfegePattern_023,
    solfegePattern_024,
    solfegePattern_025,
    solfegePattern_026,
    solfegePattern_027,
    solfegePattern_028,
    solfegePattern_029,
    solfegePattern_030,
    solfegePattern_031,
    solfegePattern_032,
    solfegePattern_033,
    solfegePattern_034,
    solfegePattern_035,
    solfegePattern_036,
    solfegePattern_037,
    solfegePattern_038,
    solfegePattern_039,
    solfegePattern_040,
    solfegePattern_041,
    solfegePattern_042,
    solfegePattern_043,
    solfegePattern_044,
    solfegePattern_045,
    solfegePattern_046,
    solfegePattern_047,
    solfegePattern_048,
    solfegePattern_049,
    solfegePattern_050,
    solfegePattern_051,
    solfegePattern_052,
    solfegePattern_053



] as const


export const solfegePatterns: TTypeOrError = solfegePatterns_pretypecheck;