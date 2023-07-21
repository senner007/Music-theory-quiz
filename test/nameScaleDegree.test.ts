import { it, expect, vi, describe, test, afterEach, Mock } from "vitest";
import { NameScaleDegree, nameScaleDegreeOptions } from "../src/quiz/nameScaleDegree";
import chalk from "chalk";
import { math_floor } from "../src/random_func";
import { TOptionsReturnType } from "../src/quiz/quiztypes/quiz-types";

describe("Test NameScaleDegree quiz", () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const quizHeadOutput = [
    `The ${chalk.underline("1st degree")} in Cb major`,
    `The ${chalk.underline("2nd degree")} in D aeolian`,
    `The ${chalk.underline("3rd degree")} in E# dorian`,
  ];

  test.each([0, 1, 2])("should generate quiz head text", (mathFloorReturnValue: number) => {

    (<Mock>math_floor).mockReturnValue(mathFloorReturnValue);

    const options = nameScaleDegreeOptions.map(o =>  {
      return {name : o.name, options : o.options() }
    }) as TOptionsReturnType<typeof nameScaleDegreeOptions>


    const quiz = new NameScaleDegree(options);

    expect(math_floor).toBeCalledTimes(4);
    expect(quiz.quiz_head).toEqual([quizHeadOutput[mathFloorReturnValue]]);
  });
});
