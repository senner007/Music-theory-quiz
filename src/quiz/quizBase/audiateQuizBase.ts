import chalk from "chalk";
import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { INotePlay } from "../../midiplay";
import { ITableHeader, SolfegeMelody } from "../../solfege";
import { TNoteSingleAccidental } from "../../utils";
import { AudioQuizBase } from "./audioQuizBase";
import { Log } from "../../logger/logSync";

export abstract class AudiateQuizBase<T> extends AudioQuizBase<T> {
  get question_options() {
    return ["Right", "Wrong"];
  }

  abstract key: TNoteSingleAccidental;
  abstract timeSignature: 1 | 2 | 3 | 4;
  abstract table_header: ITableHeader[]

  feedback(choice: string) {
    return choice === "Right" ? "Well done!" : "Try again";
  }

  async call_quiz(): Promise<string | never> {
    const solfege = new SolfegeMelody(this.audio().filter(a => a.display)[0].audio as INotePlay[], this.key, this.timeSignature);
    LogTable.write(solfege, this.table_header, this.timeSignature);

    try {
      Log.keyHooks([...this.audio().map((a) => {
        return { value: a.message, key: a.keyboardKey };
      }), { value: "change tempo", key: "ctrl-(left/right)" } ]);

      const choice = await LogAsync.questions_in_list_indexed(
        this.question_options,
        "Self-evaluation",
        "q"
      );

      return choice;
    } catch (err) {
      throw err;
    }
  }
}
