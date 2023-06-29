export interface IQuizInstance {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quiz_head: Readonly<string[]>;
  cleanup() : Promise<void>
}

export interface IQuizOptions {
  name: string;
  options : any
}

export interface IQuiz<T extends IQuizOptions[], U> {
  new (options: Readonly<T>): IQuizInstance;
  meta(): {
    all_options: Readonly<T>;
    name: string;
    description: string;
    instructions? : string[]
  };
  set_dynamic_options(options : U): void;
  get_dynamic_options(): U
  dynamic_options : U;
}
