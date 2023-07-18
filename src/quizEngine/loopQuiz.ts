import { IQuizOptions, IQuiz } from "../quiz/quiztypes/quiz-types";
import { Log } from "../logger/logSync";
import { LogAsync } from "../logger/logAsync";

export async function loopQuiz(QuizClass: IQuiz<IQuizOptions[]>, cliOptions : Record<string, IQuizOptions["options"]> | undefined) {

  var options: IQuizOptions[] = [];
  const allOptions = QuizClass.meta().all_options;

  if (!allOptions.is_empty()) {
    for (const optionType of allOptions) {
      try {
        let selectOptions
        if (cliOptions) {
          selectOptions = optionType.cliShort in cliOptions ? cliOptions[optionType.cliShort] : optionType.options
        } else {
          if ("isCli" in optionType) {
            selectOptions = optionType.options
          } else {
            selectOptions = await LogAsync.checkboxes(
              optionType.options,
              `Please select: ${optionType.name} or quit(q)`,
              "q"
            );
          }
          
        }
        options.push({ ...optionType, options: selectOptions })
      } catch (err) {
        return;
      }
    }
  }

  while (true) {
    const quiz = new QuizClass(options);

    Log.clear();
    Log.write(QuizClass.meta().description);

    for (const head of quiz.quiz_head) {
      Log.write(head);
    }

    try {
      const choice = await quiz.execute();
      Log.write(quiz.feedback(choice));
    } catch (err) {
      await quiz.cleanup();
      break;
    }

    try {
      await LogAsync.questions_in_list(
        ["Continue"],
        "Continue or Quit",
        "q"
      );
    } catch (err) {
      break;
    } finally {
      await quiz.cleanup();
    }
  }
}
