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

function reverseSyllables<T extends ISolfegePattern["patterns"]>(patterns : T) : T {
    return patterns.map(p => p.to_reverse()) as T
}

const solfegePattern_001 = {
    description: "Second-PT-Top (M3/m3)",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Above },
        { index: EChordNote.Top, step: EStep.None }],
    patterns: [
        ["Do", "Re", "Mi"],
        ["Mi", "Fa", "So"],
        ["Fa", "So", "La"],
        ["So", "La", "Ti"],
        ["La", "Ti", "Do"],
        ["Ti", "Do", "Re"],

        ["Do", "Re", "Me"],
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
        ["Mi" ,"So"],
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
    description: "Second-(NT-below)-Second",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Second, step: EStep.Below },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: [
        ["Do", "Ti", "Do"],
        ["Mi", "Re", "Mi"],
        ["So", "Fa", "So"],

        ["Do", "Ti", "Do"],
        ["Me", "Re", "Me"],
        ["Le", "So", "Le"],
    ]
} as const

const solfegePattern_005 = {
    description: "Top-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const 

const solfegePattern_006 = {
    description: "Third-PT-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Third, step: EStep.Above },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_001.patterns
} as const

const solfegePattern_007 = {
    description: "Second-Third (M3/m3)",
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Third, step: EStep.None }],
    patterns: reverseSyllables(solfegePattern_003.patterns)
} as const

const solfegePattern_008 = {
    description: "Third-Second (M3/m3)",
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_003.patterns
} as const

const solfegePatterns_Untyped = [
    solfegePattern_001,
    solfegePattern_002,
    solfegePattern_003,
    solfegePattern_004,
    solfegePattern_005,
    solfegePattern_006,
    solfegePattern_007,
    solfegePattern_008
] as const


type TPatternLengthIndexesLength<T extends typeof solfegePatterns_Untyped[number]> = 
    T extends any 
        ? T["patterns"][number]['length'] extends T["indexes"]['length'] 
            ? T["indexes"]['length'] extends T["patterns"][number]['length'] 
                ? true 
                : `Length of ${T["indexes"]['length']} not equal to length of ${T["patterns"][number]['length']} at ${T["description"]}`
            : `Length of pattern : ${T["patterns"][number]['length']} not equal to length of indexes : ${T["indexes"]['length']} at ${T["description"]}`
        : false

type TTrueOrError = TPatternLengthIndexesLength<typeof solfegePatterns_Untyped[number]> 
    
export const solfegePatterns : TTrueOrError extends true ? typeof solfegePatterns_Untyped : TTrueOrError = solfegePatterns_Untyped;