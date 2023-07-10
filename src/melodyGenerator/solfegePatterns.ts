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
    Top = -1,
    Second = -2,
    Third = -3,
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
    description: "Second-PT-Top (M3/m3)",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Above },
        { index: EChordNote.Top, step: EStep.None }],
    patterns: [
        ["Do", "Re", "Mi"],
        ["Re", "Mi", "Fa"],
        ["Mi", "Fa", "So"],
        ["Fa", "So", "La"],
        ["So", "La", "Ti"],
        ["So", "La", "Te"],
        ["La", "Ti", "Do"],
        ["Ti", "Do", "Re"],

        ["Do", "Re", "Me"],
        ["Re", "Me", "Fa"],
        ["Me", "Fa", "So"],
        ["Fa", "So", "Le"],
        ["Le", "Te", "Do"],

    ]
} as const

const solfegePattern_002 = {
    description: "Top-PT-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_001.patterns)
} as const

const solfegePattern_003 = {
    description: "Second-Top (M3/m3)",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Top, step: EStep.None }],
    patterns: [
        ["Do", "Mi"],
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
    description: "Top-(NT-below)-Top",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below },
        { index: EChordNote.Top, step: EStep.None }],
    patterns: [
        ["Do", "Ti", "Do"],
        ["Re", "Do", "Re"],
        ["Mi", "Re", "Mi"],
        ["Fa", "Mi", "Fa"],
        ["So", "Fa", "So"],
        ["Se", "Fa", "Se"],
        ["La", "So", "La"],
        ["Te", "La", "Te"],
        ["Ti", "La", "Ti"],

        ["Do", "Ti", "Do"],
        ["Me", "Re", "Me"],
        ["Fa", "Me", "Fa"],
        ["Le", "So", "Le"],
    ]
} as const

const solfegePattern_005 = {
    description: "Second-(NT-below)-Second",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Below },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_004.patterns
} as const

const solfegePattern_006 = {
    description: "Top-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const

const solfegePattern_007 = {
    description: "Third-PT-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Third, step: EStep.Above },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_001.patterns
} as const

const solfegePattern_008 = {
    description: "Second-Third (M3/m3)",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Third, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const

const solfegePattern_009 = {
    description: "Third-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_003.patterns
} as const

const solfegePattern_010 = {
    description: "Top-(PT-below)-Major",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below }],
    patterns: [
        ["Do", "Ti"],
        ["Ti", "La"],
        ["La", "So"],
        ["So", "Fa"],
        ["Fa", "Mi"],
        ["Mi", "Re"],
        ["Re", "Do"],
    ]
} as const

const solfegePattern_011 = {
    description: "Top-(PT-above)-Major",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_009.patterns)
} as const

const solfegePattern_012 = {
    description: "Second-(PT-below)-Major",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Below }],
    patterns: solfegePattern_009.patterns
} as const

const solfegePattern_013 = {
    description: "Second-(PT-above)-Major",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_009.patterns)
} as const

const solfegePattern_014 = {
    description: "Top-(PT-below)-Minor",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below }],
    patterns: [
        ["Do", "Te"],
        ["Te", "Le"],
        ["Le", "So"],
        ["So", "Fa"],
        ["Fa", "Me"],
        ["Me", "Re"],
        ["Re", "Do"],
    ]
} as const

const solfegePattern_015 = {
    description: "Top-(PT-above)-Minor",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_013.patterns).filter(s => {
        return s.toString() !== 'So,Le'
    })
} as const

const solfegePattern_016 = {
    description: "Second-(PT-below)-Minor",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Below }],
    patterns: solfegePattern_013.patterns
} as const

const solfegePattern_017 = {
    description: "Second-(PT-above)-Minor",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Above }],
    patterns: reverseSyllables(solfegePattern_013.patterns).filter(s => {
        return s.toString() !== 'So,Le'
    })
} as const

const solfegePattern_018 = {
    description: "(Second-(PT-above))-((PT-below)-Top)-Major",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Above },
        { index: EChordNote.Top, step: EStep.Below },
        { index: EChordNote.Top, step: EStep.None }
    ],
    patterns: [
        ["Fa", "So", "La", "Ti"],
        ["Re", "Mi", "Fa", "So"],
        ["La", "Ti", "Do", "Re"],
        ["Do", "Re", "Mi", "Fa"],
        ["Mi", "Fa", "So", "La"]
    ]
    
} as const

const solfegePattern_019 = {
    description: "(Top-(PT-below))-((PT-above)-Second)-Major",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below },
        { index: EChordNote.Second, step: EStep.Above },
        { index: EChordNote.Second, step: EStep.None }
    ],
    patterns: reverseSyllables(solfegePattern_018.patterns)
    
} as const

const solfegePattern_020 = {
    description: "Cadence01",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
    ],
    patterns: [
        ["Do"],
        ["Re"],
        ["Mi"],
        ["Fa"],
        ["So"],
        ["La"],
        ["Ti"],

        ["Me"],
        ["Le"],
        ["Te"]
    ]
    
} as const

const solfegePattern_021 = {
    description: "Cadence02",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
} as const


const solfegePattern_022 = {
    description: "Cadence03",
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
    ],
    patterns: solfegePattern_020.patterns
    
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
    solfegePattern_022
] as const


export const solfegePatterns: TTypeOrError = solfegePatterns_pretypecheck;