import { Quiz } from "../quiz-types";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
import { Log } from "../logger/logSync";
import { LogAsync } from "../logger/logAsync";

export async function loopQuiz(QuizClass: Quiz<any>) {

  while (true) {

    const quiz = new QuizClass(QuizClass.meta().getAllOptions);

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
