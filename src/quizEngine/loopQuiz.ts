import { IQuizOptions, IQuiz } from "../quiz-types";
// @ts-ignore
// import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Log } from "../logger/logSync";
import { LogAsync } from "../logger/logAsync";


export async function loopQuiz(QuizClass: IQuiz<IQuizOptions[], any>) {

  var options : IQuizOptions[] = [];
  const allOptions = QuizClass.meta().all_options;
  
  if (!allOptions.is_empty()) {
    for (const optionType of allOptions) {
      try {
        const selectOptions = await LogAsync.checkboxes(
          optionType.options,
          "Choose quiz options or quit(q)",
          "q"
        );
        options.push({ name : optionType.name, options: selectOptions})
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
