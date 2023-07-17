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
import { program, Option } from "commander";
import { isDev } from "./dev-utils";

process.stdin.setMaxListeners(20);
// Log.clear();

Log.write("Found MIDI outputs:");
for (const mididevice of easymidi.getOutputs()) {
  Log.success(mididevice);
}

const quizzes: IQuiz<any>[] = [
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

let cliOptions = getCliOptions();
// Example : npm run dev -- --type AudiateHarmony --progression e6 --Keys C

function getCliOptions() {

  program.addOption(new Option("-t, --type <string>", "quiz type").choices(quizzes.map((q) => q.id)));

  const cliOptions = quizzes.map((q: IQuiz<IQuizOptions[]>) => {
    return q.meta().all_options;
  });

  cliOptions.flat().forEach((o) => {
    program.addOption(
      new Option(`--${o.name} <string...>`, `${o.name}`)
        .argParser((value: any, previous: any) => {
          if (typeof o.options[0] === "number") {
            if (previous) return [previous, Number(value)].flat();

            return Number(value);
          }
          if (previous) return [previous, value].flat();

          return value;
      })
      .choices(o.options)
    );
  });

  program.parse();

  const options = program.opts();

  return "type" in options ? options : undefined;
}

;(async () => {
  while (true) {
    try {
      let choiceSelection;
      if(cliOptions) {
        choiceSelection = quizzes.filter((q) => q.id === cliOptions!.type).first_and_only();
      } else {
        const choice = await LogAsync.questions_in_list(
          quizzes.map((quiz) => quiz.meta().name),
          "Choose a quiz",
          "q"
        );
        choiceSelection = quizzes.filter((q) => q.meta().name === choice).first_and_only();
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
