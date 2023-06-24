import chalk from "chalk";
import { isDev } from "../dev-utils";
import rs from "readline-sync";

export class Log {
    static clear() {
      if (!isDev()) {
        console.clear();
      }
    }
    static write(content: string) {
      console.log(content);
    }
  
    static success(content: string) {
      this.write(chalk.green(content));
    }
  
    static error(content: string) {
      this.write(chalk.red(content));
    }

    static stack(content: string) {
      this.write(chalk.yellow(content));
    }
  
    static keyInSelect(questionOptions: string[], question: string) {
      return rs.keyInSelect(
        questionOptions,
        question,
        { cancel: false }
      );
    }
  
    static continue(message: string) {
      return rs.question(message, { hideEchoBack: true, mask: "" });
    }
  }