import chalk from "chalk";
import { LogAsync } from "../../logger/logAsync";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class ListeningQuizBase<T> extends AudioQuizBase<T> {
  abstract answer(): Readonly<string>;

  feedbackWrong() {
    return `${chalk.red("Wrong!")} Don't guess\nCorrect answer is : ${this.answer()}`;
  }

  feedback(guess: string): string {
    const isCorrect = this.answer() === guess;
    return isCorrect ? chalk.green("Right!") : this.feedbackWrong();
  }

  async callQuiz(): Promise<string | never> {
    try {
      const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
        this.questionOptions,
        this.question,
        "q",
        this.getAudio().map((la) => {
          return { value: la.message, key: la.keyboardKey };
        })
      );
      return choice;
    } catch (err) {
      throw err;
    }
  }
}
