import { LogError } from "../../dev-utils";
import { Quiz } from "../../quiz-types";

export interface IListener {
  listener: (_: any, key: any) => void;
  acObj?: { ac: AbortController };
  channel? : number;
}

export abstract class QuizBase<T> {
  listenersArray: IListener[] = [];

  constructor(options: Readonly<T>) {
    this.errorCheckOptions(options);
    this.listenersArray.push(this.scrollListener());
  }

  private scrollListener(): IListener {
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

  private errorCheckOptions(options: Readonly<T>): void | never {
    const optionsAreValid = this.verifyOptions(options);
    const quizConstructor: Quiz<any> = this.constructor as Quiz<any>;
    if (!optionsAreValid) LogError("options invalid in class: " + "'" + quizConstructor.meta.name + "'");
  }

  protected abstract verifyOptions(options: Readonly<T>): boolean;
  abstract questionOptions: Readonly<string[]>;
  abstract question: string;

  protected attachListeners(listeners: IListener[]) {
    for (const listener of listeners) {
      process.stdin.on("keypress", listener.listener);
    }
  }

  private detachListeners(listeners: IListener[]) {
    for (const listener of listeners) {
      listener.acObj?.ac.abort();
      process.stdin.off("keypress", listener.listener);
    }
  }

  cleanup = async (): Promise<void> => {
    this.detachListeners(this.listenersArray);
  };
}
