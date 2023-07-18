import { program, Option } from "commander";
import { quizContainer } from "../quizContainer";
import { IQuiz, IQuizOptions } from "../quiz/quiztypes/quiz-types";

export function getCliOptions() {

    program
      .showHelpAfterError()
      .helpOption('--what', 'read more information')
      .addHelpText('after', 
        '\nQuiz arguments help: \n   --type [quiz type] --what'
      )
      .addHelpText('after', 
        '\nExample: \n   $ npm run dev -- --type AudiateHarmony --p e6 --k C --m Chords'
      )
  
    const argsTypeIndex = process.argv.findIndex((a, index) => a === "--type")
    const classType = process.argv[argsTypeIndex +1];
  
    program
      .addOption(new Option("-t, --type <string>", "quiz type")
      .choices(quizContainer.map((q) => q.id)))
    
    const quizOptions = quizContainer
      .filter(q => q.id === classType)
      .map((q: IQuiz<IQuizOptions[]>) => {
        return q.meta().all_options;
      });
  
    quizOptions.flat().forEach((o) => {
      program.addOption(
        new Option(`--${o.cliShort} <string...>`, `${o.name}`)
        .choices(o.options)
      );
    });
    
    program.parse();
    const options = program.opts();
  
    return "type" in options ? options : undefined;
  }