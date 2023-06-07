import { Quiz } from "../quiz-types";
// @ts-ignore
// import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Log } from "../logger/logSync";
import { LogAsync } from "../logger/logAsync";


export async function loopQuiz(QuizClass: Quiz<any>) {

  var options : string[] = [];
  const allOptions = QuizClass.meta().getAllOptions as string[];
  if (!allOptions.isEmpty()) {
    try {
      options = await LogAsync.checkboxes(
        allOptions,
        "Choose quiz options or quit(q)",
        "q"
      );
    } catch (err) {
      return;
    }
  }
 
  while (true) {

    const quiz = new QuizClass(options);

    Log.clear();
    Log.write(QuizClass.meta().description);

    for (const head of quiz.quizHead) {
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
      await LogAsync.questionInList(
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
