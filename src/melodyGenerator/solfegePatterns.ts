import { TSyllable } from "../solfege";

export interface ISolfegePattern {
    description: string;
    indexes: { index: EChordNote, step: EStep }[]
    patterns: TSyllable[][];
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

const solfegePattern_001 = {
    description: "2nd-PT-1st (M3/m3)" as const,
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
} as const satisfies ISolfegePattern;

const solfegePattern_002 = {
    description: "1st-PT-2nd (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Top, step: EStep.Below },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_001.patterns.map(p => p.slice(0).reverse())
} as const satisfies ISolfegePattern;


const solfegePattern_003 = {
    description: "2nd-1st (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Second, step: EStep.None }, // type to ensure indexes length is equal to pattern length
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
} as const satisfies ISolfegePattern;


const solfegePattern_004 = {
    description: "2nd-(NT-below)-2nd" as const,
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
} as const satisfies ISolfegePattern;

const solfegePattern_005 = {
    description: "1st-2nd (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Top, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_001.patterns.map(p => p.slice(0).reverse())
} as const satisfies ISolfegePattern;

const solfegePattern_006 = {
    description: "3rd-PT-2nd (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Third, step: EStep.Above },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_001.patterns
} as const satisfies ISolfegePattern;

const solfegePattern_007 = {
    description: "2nd-3rd (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Second, step: EStep.None },
        { index: EChordNote.Third, step: EStep.None }],
    patterns: solfegePattern_005.patterns
} as const satisfies ISolfegePattern;

const solfegePattern_008 = {
    description: "3rd-2nd (M3/m3)" as const,
    indexes: [
        { index: EChordNote.Third, step: EStep.None },
        { index: EChordNote.Second, step: EStep.None }],
    patterns: solfegePattern_003.patterns
} as const satisfies ISolfegePattern;

export const solfegePatterns = [
    solfegePattern_001,
    solfegePattern_002,
    solfegePattern_003,
    solfegePattern_004,
    solfegePattern_005,
    solfegePattern_006,
    solfegePattern_007,
    solfegePattern_008
] as const