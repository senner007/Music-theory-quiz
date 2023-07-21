import { program, Option, OptionValues } from "commander";
import { quizContainer } from "../quizContainer";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "../quiz/quiztypes/quiz-types";
import chalk from "chalk";
import { ObjectEntries } from "../objectUtils";

function checkArrayOrder(arr1: string[], arr2: string[]): boolean {
  const a = arr1.filter((a) => arr2.includes(a));
  const b = arr2.filter((b) => arr1.includes(b));

  return JSON.stringify(a) === JSON.stringify(b);
}

function formatProcessArgs(ars : string) { // remove ^
  return ars.replace(/\^/g,"");
}

function everyElementIn(arr1: any[], arr2: any[]) {
  return arr1.every((r) => arr2.includes(r));
}

function findArgsForOption(arg: string) {
  const argsTypeIndex = process.argv.findIndex((a, index) => a === arg);

  if (argsTypeIndex === -1) return undefined;

  const argsArray = [];
  for (let i = argsTypeIndex + 1; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("--")) break;
    process.argv[i] = formatProcessArgs(process.argv[i])
    argsArray.push(process.argv[i]);
  }
  return argsArray;
}

const line = "-------------------------------------------";

function setClassTypeOption() {
  const classType = findArgsForOption("--type");
  const allClassTypes = quizContainer.map((q) => q.name);

  if (classType && classType.length > 1) {
    program.error(chalk.red(`${line}\nPlease provide only one type\n${line}`));
  }

  program.addOption(
    new Option(
      "-t, --type <string>",
      `Quiz type ${
        classType
          ? `- ${allClassTypes.includes(classType.first_and_only()) ? chalk.green(classType) : chalk.red(classType)}`
          : ""
      }`
    ).choices(allClassTypes)
  );

  return classType;
}

function setTypeConditionalOptions(quizOptions: IQuizOptions[]) {
  let quizOptionsArray: TOptionsReturnType<IQuizOptions[]> = [];

  quizOptions.forEach((o) => {
    const options = o.options(quizOptionsArray);

    const argsFound = findArgsForOption("--" + o.cliShort);

    quizOptionsArray.push({ name: o.name, options: argsFound ? argsFound : options });

    const cmdOption = new Option(
      `--${o.cliShort} <string...>`,
      `${o.name} ${
        argsFound ? `${everyElementIn(argsFound, options) ? chalk.green(argsFound) : chalk.red(argsFound)}` : ""
      }`
    );

    program.addOption(cmdOption.choices(options));
  });
}

export function getCliOptions() {

  program
    .showHelpAfterError()
    .helpOption("--what", "more information")
    .addHelpText("after", "\nQuiz arguments help:\n--type [quiz type] --what")
    .addHelpText("after", "Example:\n$ npm run dev -- --type AudiateHarmony --m Chords --k C --p e1 e2");

  const classType = setClassTypeOption();

  const quizOptions = quizContainer
    .filter((q) => q.name === classType?.first_and_only())
    .map((q: IQuiz<IQuizOptions[]>) => {
      return q.meta().all_options;
    })
    .flat()

  setTypeConditionalOptions(quizOptions);

  program.parse();
  const options = program.opts();

  const cliOptions = quizOptions.map((o) => o.cliShort);

  const isSameOrder = checkArrayOrder(
    ObjectEntries(options).keys.filter((o) => cliOptions.includes(o)),
    cliOptions
  );
  if (!isSameOrder) {
    program.error(chalk.red(`${line}\nPlease provide conditional options in order as follows:\n${line}`));
  }

  if (!classType) {
    return;
  }

  return options;
}
