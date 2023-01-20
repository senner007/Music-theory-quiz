import chalk from "chalk";
import { LogAsync } from "../../logger/logAsync";
import { QuizBase } from "./quizBase";

export abstract class TextQuizBase<T> extends QuizBase<T> {

  async execute(): Promise<string | never> {
    this.attachListeners(this.listenersArray);
    const choice = await LogAsync.questionInListIndexed(this.questionOptions, this.question, "q");
    return choice;
  }

  abstract answer(): Readonly<string>;

  feedback(guess: string): string {
    const isCorrect = this.answer() === guess;
    const feedbackWrong = `${chalk.red("Wrong!")} Don't guess\nCorrect answer is : ${this.answer()}`;
    return isCorrect ? chalk.green("Right!") : feedbackWrong;
  }
}
