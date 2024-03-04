import { program, Option, OptionValues } from "commander";
import { quizContainer } from "../quizContainer";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "../quiz/quiztypes/quiz-types";
import chalk from "chalk";
import { ObjectEntries } from "../objectUtils";
import { isDev } from "../dev-utils";
import { findArgsForOption, ARG_PREFIX, line, everyElementIn, checkArrayOrder, HELP_ARG, QUIZ_TYPE_ARG } from "./cliOptionsHelpers";

function setClassTypeOption() {
  const classType = findArgsForOption(`${ARG_PREFIX}${QUIZ_TYPE_ARG}`);

  const allClassTypes = quizContainer.map((q) => q.name);

  if (classType && classType.length > 1) {
    program.error(chalk.red(`${line}\nPlease provide only one type\n${line}`));
  }

  program.addOption(
    new Option(
      `${ARG_PREFIX}${QUIZ_TYPE_ARG} <string>`,
      `Quiz type ${
        classType
          ? `${allClassTypes.includes(classType.first_and_only()) ? chalk.green(classType) : chalk.red(classType)}`
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

    const argsFound = findArgsForOption(`${ARG_PREFIX}${o.cliShort}`);

    quizOptionsArray.push({ name: o.name, options: argsFound ? argsFound : options });

    const cmdOption = new Option(
      `${ARG_PREFIX}${o.cliShort} <string...>`,
      `${o.name} ${
        argsFound ? `${everyElementIn(argsFound, options) ? chalk.green(argsFound) : chalk.red(argsFound)}` : ""
      }`
    );

    program.addOption(cmdOption.choices(options));
  });
}

function checkOptionsInOrder(quizOptions: IQuizOptions[], parsedOptions: OptionValues) {
  const cliOptions = quizOptions.map((o) => o.cliShort);

  const isSameOrder = checkArrayOrder(
    ObjectEntries(parsedOptions).keys.filter((o) => cliOptions.includes(o)),
    cliOptions
  );
  if (!isSameOrder) {
    program.error(chalk.red(`${line}\nPlease provide conditional options in order as follows:\n${line}`));
  }
}

export function getCliOptions() {

  program
    .showHelpAfterError()
    .helpOption(`${ARG_PREFIX}${HELP_ARG}`, "Help")
    .addHelpText("after", `\nQuiz arguments help:\n${ARG_PREFIX}${QUIZ_TYPE_ARG} [quiz type] ${ARG_PREFIX}${HELP_ARG}`)
    .addHelpText(
      "after",
      `Example:\n$ npm run dev ${ARG_PREFIX} ${ARG_PREFIX}${QUIZ_TYPE_ARG} AudiateHarmony ${ARG_PREFIX}m Chords ${ARG_PREFIX}k C ${ARG_PREFIX}p e1 e2`
    );

  const classType = setClassTypeOption();

  const quizTypeOptions = quizContainer
    .filter((q) => q.name === classType?.first_and_only())
    .map((q: IQuiz<IQuizOptions[]>) => {
      return q.meta().all_options;
    })
    .flat();

  setTypeConditionalOptions(quizTypeOptions);

  program.parse();
  const parsedOptions = program.opts();

  checkOptionsInOrder(quizTypeOptions, parsedOptions);
  if (!classType) {
    return;
  }

  return parsedOptions;
}
