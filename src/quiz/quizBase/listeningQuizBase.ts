import chalk from "chalk";
import { LogAsync } from "../../logger/logAsync";
import { AudioQuizBase } from "./audioQuizBase";

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
      const choice = await LogAsync.questions_in_list_indexed_global_key_hook(
        this.question_options,
        this.question,
        "q",
        this.audio().map((a) => {
          return { value: a.message, key: a.keyboardKey };
        })
      );
      return choice;
    } catch (err) {
      throw err;
    }
  }
}
