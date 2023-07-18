import "./arrayProto";
import { customExit, is_interrupt } from "./utils";
import { IQuiz, IQuizOptions } from "./quiz/quiztypes/quiz-types";
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

import { isDev } from "./dev-utils";
import { getCliOptions } from "./cliOptions/cliOptions";
import { quizContainer } from "./quizContainer";

process.stdin.setMaxListeners(20);
// Log.clear();

Log.write("Found MIDI outputs:");
for (const mididevice of easymidi.getOutputs()) {
  Log.success(mididevice);
}


let cliOptions = getCliOptions();


;(async () => {
  while (true) {
    try {
      let choiceSelection;
      if(cliOptions) {
        choiceSelection = quizContainer.filter((q) => q.id === cliOptions!.type).first_and_only();
      } else {
        const choice = await LogAsync.questions_in_list(
          quizContainer.map((quiz) => quiz.meta().name),
          "Choose a quiz",
          "q"
        );
        choiceSelection = quizContainer.filter((q) => q.meta().name === choice).first_and_only();
      }
      await loopQuiz(choiceSelection, cliOptions);
      cliOptions = undefined
      Log.clear();
    } catch (err) {
      if (is_interrupt(err)) {
        customExit();
      }
    }
  }
})();
