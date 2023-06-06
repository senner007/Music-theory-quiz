import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { ITableHeader, SolfegeMelody } from "../../solfege";
import { noteSingleAccidental } from "../../utils";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class SingingQuizBase<T> extends AudioQuizBase<T> {
  get questionOptions() {
    return ["Right", "Wrong"];
  }

  abstract randomNote: noteSingleAccidental;

  abstract tableHeader: ITableHeader[]

  feedback(choice: string) {
    return choice === "Right" ? "Well done!" : "Try again";
  }

  async callQuiz(): Promise<string | never> {
    const solfege = new SolfegeMelody(this.getAudio().filter(a => a.display)[0].audio[0], this.randomNote);
    LogTable.write(solfege, this.tableHeader);

    try {
      const choice = await LogAsync.questionInListIndexedGlobalKeyHook(
        this.questionOptions,
        "Self-evaluation",
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
