import { LogError } from "../../dev-utils";
import { IQuiz } from "../quiztypes/quiz-types";

export interface IListener {
  listener: (_: any, key: any) => void;
  acObj?: { ac: AbortController };
  isBackgroundChannel?: boolean;
}

export abstract class QuizBase<T> {
  listenersArray: IListener[] = [];

  constructor(options: Readonly<T>) {
    this.error_check_options(options);
    this.listenersArray.push(this.scroll_listener());
  }

  private scroll_listener(): IListener {
    const twice = (func: Function) => {
      for (let i = 0; i < 2; i++) {
        func();
      }
    };

    const listener = (_: any, key: any) => {
      if (key.name === "pageup") {
        twice(() => process.stdin.emit("keypress", null, { name: "up" }));
      }
      if (key.name === "pagedown") {
        twice(() => process.stdin.emit("keypress", null, { name: "down" }));
      }
    };
    return {
      listener
    };
  }

  private error_check_options(options: Readonly<T>): void | never {
    const optionsAreValid = this.verify_options(options);
    const quizConstructor: IQuiz<any> = this.constructor as IQuiz<any>;
    if (!optionsAreValid) LogError("options invalid in class: " + "'" + quizConstructor.name + "'");
  }

  protected abstract verify_options(options: Readonly<T>): boolean;
  abstract question_options: Readonly<string[]>;
  abstract question: string;

  protected attach_listeners(listeners: IListener[]) {
    for (const listener of listeners) {
      process.stdin.on("keypress", listener.listener);
    }
  }

  private detach_listeners(listeners: IListener[]) {
    for (const listener of listeners) {
      listener.acObj?.ac.abort();
      process.stdin.off("keypress", listener.listener);
    }
  }

  cleanup = async (): Promise<void> => {
    this.detach_listeners(this.listenersArray);
  };
}
