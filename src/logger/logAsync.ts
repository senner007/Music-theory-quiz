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
  protected static get_options(questionOptions: Readonly<string[]>): IOptions[] {
    return questionOptions.map((q) => {
      return { value: q };
    });
  }

  protected static get_checkbox_options(questionOptions: Readonly<string[]>): ICheckboxChoices[] {
    return questionOptions.map((o) => {
      return { value: o, name: o, checked : true };
    });
  }

  protected static get_options_indexed(questionOptions: Readonly<string[]>): IOptionsIndexed[] {
    return this.get_options(questionOptions).map((o: IOptions, index: number) => {
      return { value: o.value, name: "(" + (index + 1) + ") " + o.value };
    });
  }

  protected static add_separators(questionOptions: (IOptions | IOptionsIndexed)[], interruptKey: string): IChoices {
    const quitValue = `(${interruptKey}) Quit`;
    const choices: IChoices = {
      options: questionOptions,
      separator: new inquirer.Separator(),
      interrupt: { value: quitValue },
    };
    return choices;
  }

  protected static async get_questions(
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

  protected static async get_checkboxes(
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
const bottomBar = new inquirer.ui.BottomBar();
export { bottomBar }


export class LogAsync extends LogAsyncUtil {
  static async questions_in_list(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string | never> {
    const options = this.get_options(questionOptions);
    return this.get_questions(this.add_separators(options, interruptKey), question, interruptKey);
  }

  static async questions_in_list_indexed(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string | never> {
    const options = this.get_options_indexed(questionOptions);
    return this.get_questions(this.add_separators(options, interruptKey), question, interruptKey);
  }

  static async questions_in_list_indexed_global_key_hook(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string,
    globalHook: IGlobalHook[]
  ): Promise<string | never> {
    const options = this.get_options_indexed(questionOptions);
    const questionWithHook =
      question +
      chalk.bgWhite.gray(globalHook.map((hook) => `\nPress ${hook.key} to ${hook.value} `).join(""));
    return this.get_questions(this.add_separators(options, interruptKey), questionWithHook, interruptKey);
  }

  static async checkboxes(
    questionOptions: Readonly<string[]>,
    question: string,
    interruptKey: string
  ): Promise<string[] | never> {
    const options = this.get_checkbox_options(questionOptions);
    return this.get_checkboxes({options, interrupt : { value: interruptKey } }, question, interruptKey);
  }
}