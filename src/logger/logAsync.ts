import chalk from "chalk";
import inquirer from "inquirer";
// @ts-ignore
import InterruptedPrompt from "inquirer-interrupted-prompt";
InterruptedPrompt.fromAll(inquirer);

export interface IOptions {
  value: string;
}

export interface IOptionsIndexed extends IOptions {
  name: string;
}

interface ICheckboxChoices extends IOptionsIndexed {
  checked: boolean;
}

export interface IGlobalHook {
  value: string;
  key: string;
}

interface IChoices {
  options: (IOptions | IOptionsIndexed | ICheckboxChoices)[];
  separator?: inquirer.Separator;
  interrupt: IOptions;
}

class LogAsyncUtil {
  protected static getOptions(questionOptions: Readonly<string[]>): IOptions[] {
    return questionOptions.map((q) => {
      return { value: q };
    });
  }

  protected static getCheckboxOptions(questionOptions: Readonly<string[]>): ICheckboxChoices[] {
    return questionOptions.map((o) => {
      return { value: o, name: o, checked : true };
    });
  }

  protected static getOptionsIndexed(questionOptions: Readonly<string[]>): IOptionsIndexed[] {
    return this.getOptions(questionOptions).map((o: IOptions, index: number) => {
      return { value: o.value, name: "(" + (index + 1) + ") " + o.value };
    });
  }

  protected static addSeparators(questionOptions: (IOptions | IOptionsIndexed)[], interruptKey: string): IChoices {
    const quitValue = `(${interruptKey}) Quit`;
    const choices: IChoices = {
      options: questionOptions,
      separator: new inquirer.Separator(),
      interrupt: { value: quitValue },
    };
    return choices;
  }

  protected static async getQuestions(
    choices: IChoices,
    question: string,
    interruptKey: string,
  ): Promise<string | never> {
    const choiceArray = [...choices.options, choices.separator, choices.interrupt];
    try {
      const answer: { question: string } = await inquirer.prompt([
        {
          type : "list",
          name: "question",
          message: question,
          choices: choiceArray,
          pageSize: choiceArray.length,
          interruptedKeyName: interruptKey,
        },
      ]);

      if (answer.question === choices.interrupt.value) {
        throw InterruptedPrompt.EVENT_INTERRUPTED;
      }

      return answer?.question;
    } catch (err) {
      throw err;
    }
  }

  protected static async getCheckboxes(
    choices: IChoices,
    question: string,
    interruptKey: string,
  ): Promise<string[] | never> {
    try {
      const answer: { question: string } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "question",
          message: question,
          choices: choices.options,
          pageSize: choices.options.length,
          interruptedKeyName: interruptKey,
        },
      ]);

      if (answer.question === choices.interrupt.value) {
        throw InterruptedPrompt.EVENT_INTERRUPTED;
      }

      return answer?.question as unknown as string[];
    } catch (err) {
      throw err;
    }
  }
}



export class LogAsync extends LogAsyncUtil {
  static async questionInList(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string | never> {
    const options = this.getOptions(questionOptions);
    return this.getQuestions(this.addSeparators(options, interruptKey), question, interruptKey);
  }

  static async questionInListIndexed(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string | never> {
    const options = this.getOptionsIndexed(questionOptions);
    return this.getQuestions(this.addSeparators(options, interruptKey), question, interruptKey);
  }

  static async questionInListIndexedGlobalKeyHook(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string,
    globalHook: IGlobalHook[]
  ): Promise<string | never> {
    const options = this.getOptionsIndexed(questionOptions);
    const questionWithHook =
      question +
      chalk.bgWhite.gray(globalHook.map((hook) => "\n  Press " + hook.key + " to " + hook.value + " ").join("")); // beautify me!
    return this.getQuestions(this.addSeparators(options, interruptKey), questionWithHook, interruptKey);
  }

  static async checkboxes(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string[] | never> {
    const options = this.getCheckboxOptions(questionOptions);
    return this.getCheckboxes({options, interrupt : { value: interruptKey } }, question, interruptKey);
  }
}