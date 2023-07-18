export interface IQuizInstance {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quiz_head: Readonly<string[]>;
  cleanup() : Promise<void>
}

type IOptions = {
  name: string;
  options : string[];
  cliShort: string
}

export type IQuizOptions = IOptions | (IOptions & { isCli : true })

export interface IQuiz<T extends IQuizOptions[]>  {
  new (options: Readonly<T>): IQuizInstance;
  id : string;
  meta(): {
    all_options: Readonly<T>;
    name: string;
    description: string;
    instructions? : string[]
  };
}
