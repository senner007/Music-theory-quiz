import "./arrayProto"
import { customExit, is_interrupt } from "./utils";
import { IQuiz } from "./quiz-types";
import { MissingScaleNote } from "./quiz/missingScaleNote";
import { WhichTriad } from "./quiz/whichTriad";
import { NameScaleDegree } from "./quiz/nameScaleDegree";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { HearTetraChord } from "./quiz/hearTetraChord";
import { LogAsync } from "./logger/logAsync";
import easymidi from "easymidi";
import { Log } from "./logger/logSync";
import { HearScales } from "./quiz/hearScales";
import { Hear12thTone } from "./quiz/hear12thTone";
import { HearTrichordPitchPatterns } from "./quiz/hearTrichordPitchPattern";
import { AudiateFunctionalDegrees as AudiateFunctionalDegrees } from "./quiz/audiateFunctionDegrees";
import { AudiateHarmony } from "./quiz/audiateHarmony";
import { AudiateBassLines } from "./quiz/audiateBassLines";
import { AudiateContextualIntervals } from "./quiz/audiateContextualIntervals";
import { JSON_progressions_verify } from "./harmony/harmonicProgressions";
import inquirer from "inquirer";

process.stdin.setMaxListeners(20);
Log.clear();

Log.write("Found MIDI outputs:");
for (const mididevice of easymidi.getOutputs()) {
  Log.success(mididevice);
}

JSON_progressions_verify()

const quizzes: IQuiz<any, any>[] = [
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
  AudiateContextualIntervals
];


;(async () => {
  while (true) {
    try {
      const choice = await LogAsync.questions_in_list(
        quizzes.map((quiz) => quiz.meta().name),
        "Choose a quiz",
        "q"
      );

      const choiceSelection = quizzes.filter((q) => q.meta().name === choice)[0];
      await loopQuiz(choiceSelection);
      Log.clear();
    } catch (err) {
      if (is_interrupt(err)) {
        customExit();
      }
    }
  }
})();
