export interface IQuizInstance {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quizHead: Readonly<string[]>;
  cleanup() : Promise<void>
}

export interface IQuizOptions {
  name: string;
  options : any
}

export interface IQuiz<T extends IQuizOptions[]> {
  new (options: Readonly<T>): IQuizInstance;
  meta(): {
    getAllOptions: Readonly<T>;
    name: string;
    description: string;
    instructions? : string[]
  };
}
