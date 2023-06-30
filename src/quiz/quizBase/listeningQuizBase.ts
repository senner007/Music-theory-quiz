import chalk from "chalk";
import { LogAsync } from "../../logger/logAsync";
import { AudioQuizBase } from "./audioQuizBase";
import { Log } from "../../logger/logSync";

export abstract class ListeningQuizBase<T> extends AudioQuizBase<T> {
  abstract answer(): Readonly<string>;

  feedback_wrong() {
    return `${chalk.red("Wrong!")} Don't guess\nCorrect answer is : ${this.answer()}`;
  }

  feedback(guess: string): string {
    const isCorrect = this.answer() === guess;
    return isCorrect ? chalk.green("Right!") : this.feedback_wrong();
  }

  async call_quiz(): Promise<string | never> {
    try {
      Log.keyHooks([...this.audio().map((a) => {
        return { value: a.message, key: a.keyboardKey };
      }), { value: "change tempo", key: "ctrl-(left/right)" }]);

      const choice = await LogAsync.questions_in_list_indexed(
        this.question_options,
        this.question,
        "q"
      );
      return choice;
    } catch (err) {
      throw err;
    }
  }
}
