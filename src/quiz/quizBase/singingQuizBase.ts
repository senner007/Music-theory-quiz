import { LogAsync } from "../../logger/logAsync";
import { LogTable } from "../../logger/logTable";
import { INotePlay } from "../../midiplay";
import { ITableHeader, SolfegeMelody } from "../../solfege";
import { TNoteSingleAccidental } from "../../utils";
import { AudioQuizBase } from "./audioQuizBase";

export abstract class SingingQuizBase<T> extends AudioQuizBase<T> {
  get question_options() {
    return ["Right", "Wrong"];
  }

  abstract randomNote: TNoteSingleAccidental;

  abstract table_header: ITableHeader[]

  feedback(choice: string) {
    return choice === "Right" ? "Well done!" : "Try again";
  }

  async call_quiz(): Promise<string | never> {
    const solfege = new SolfegeMelody(this.audio().filter(a => a.display)[0].audio as INotePlay[], this.randomNote);
    LogTable.write(solfege, this.table_header);

    try {
      const choice = await LogAsync.questions_in_list_indexed_global_key_hook(
        this.question_options,
        "Self-evaluation",
        "q",
        this.audio().map((la) => {
          return { value: la.message, key: la.keyboardKey };
        })
      );

      return choice;
    } catch (err) {
      throw err;
    }
  }
}
