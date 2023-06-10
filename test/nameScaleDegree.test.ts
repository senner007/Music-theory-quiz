import { it, expect, vi, describe, test, afterEach, Mock } from "vitest";
import { NameScaleDegree } from "../src/quiz/nameScaleDegree";
import chalk from "chalk";
import { math_floor } from "../src/random_func";

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
    const quiz = new NameScaleDegree(NameScaleDegree.meta().getAllOptions);
    expect(math_floor).toBeCalledTimes(4);
    expect(quiz.quizHead).toEqual([quizHeadOutput[mathFloorReturnValue]]);
  });
});
