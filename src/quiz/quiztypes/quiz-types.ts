export interface IQuizInstance {
  execute() : Promise<string | never>
  feedback(choice: string): string;
  quiz_head: Readonly<string[]>;
  cleanup() : Promise<void>
}

type IOptions = {
  readonly name: string;
  readonly options : (previousOptions? : TOptionsReturnType<IQuizOptions[]>) =>  string[];
  readonly cliShort: string
}

export type IQuizOptions = IOptions | (IOptions & { readonly isCli : true })

export type TOptionsReturnType<MyType extends readonly {name : string, options : IOptions["options"]}[], PropType extends keyof MyType[number] = "options"> = {
  [k in keyof MyType] : {
      name : MyType[k]["name"]  
      options: MyType[k][PropType] extends  (...args: any) => any ? ReturnType<MyType[k][PropType]> : never 
      }
}

export interface IQuiz<T extends IQuizOptions[]>  {
  new (options: Readonly<TOptionsReturnType<T>> ): IQuizInstance;
  meta(): {
    all_options: Readonly<T>;
    name: string;
    description: string;
    instructions? : string[]
  };
}
