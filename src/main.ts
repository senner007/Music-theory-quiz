import "./arrayProto";
import { customExit, is_fatal, is_interrupt } from "./utils";
import { loopQuiz } from "./quizEngine/loopQuiz";
import { LogAsync } from "./logger/logAsync";
import easymidi from "easymidi";
import { Log } from "./logger/logSync";
import { getCliOptions, quizTypeArg } from "./cliOptions/cliOptions";
import { quizContainer } from "./quizContainer";
import { LogError } from "./dev-utils";

process.stdin.setMaxListeners(20);
Log.clear();

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
        choiceSelection = quizContainer.filter((q) => q.name === cliOptions![quizTypeArg]).first_and_only();
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
      if (is_fatal(err)) {
        customExit((err as Error).message);
      }
    }
  }
})();
