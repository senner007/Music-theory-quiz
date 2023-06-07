export interface IQuiz {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quizHead: Readonly<string[]>;
  cleanup() : Promise<void>
}

export interface IQuizOptions {
  name: string;
  options : any
}

export interface Quiz<T extends IQuizOptions[]> {
  new (options: Readonly<T>): IQuiz;
  meta(): {
    getAllOptions: Readonly<T>;
    name: string;
    description: string;
    instructions? : string[]
  };
}
