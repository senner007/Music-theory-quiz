export interface IQuizInstance {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quiz_head: Readonly<string[]>;
  cleanup() : Promise<void>
}

export type IQuizOptions = {
  name: string;
  options : any;
} | {
  name : string;
  isCli : true;
  options : any;
}

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
