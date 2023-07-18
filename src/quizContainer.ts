import { AudiateBassLines } from "./quiz/audiateBassLines";
import { AudiateContextualIntervals } from "./quiz/audiateContextualIntervals";
import { AudiateFunctionalDegrees } from "./quiz/audiateFunctionDegrees";
import { AudiateHarmony } from "./quiz/audiateHarmony";
import { Hear12thTone } from "./quiz/hear12thTone";
import { HearScales } from "./quiz/hearScales";
import { HearTetraChord } from "./quiz/hearTetraChord";
import { HearTrichordPitchPatterns } from "./quiz/hearTrichordPitchPattern";
import { MissingScaleNote } from "./quiz/missingScaleNote";
import { NameScaleDegree } from "./quiz/nameScaleDegree";
import { IQuiz } from "./quiz/quiztypes/quiz-types";
import { WhichTriad } from "./quiz/whichTriad";

export const quizContainer: IQuiz<any>[] = [
    MissingScaleNote,
    NameScaleDegree,
    WhichTriad,
    HearTetraChord,
    HearScales,
    Hear12thTone,
    HearTrichordPitchPatterns,
    AudiateFunctionalDegrees,
    AudiateHarmony,
    AudiateBassLines,
    AudiateContextualIntervals,
  ] as const;
  