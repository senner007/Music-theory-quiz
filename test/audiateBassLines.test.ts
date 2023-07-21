import { expect, vi, describe, test, afterEach, Mock } from "vitest";
import chalk from "chalk";
import { AudiateBassLines, bassLineOptions } from "../src/quiz/audiateBassLines";
import { LogTable } from "../src/logger/logTable";
import { SolfegeMelody } from "../src/solfege";
import { math_floor } from "../src/random_func";
import { TOptionsReturnType, IQuizOptions } from "../src/quiz/quiztypes/quiz-types";
import { progressions, TProgression } from "../src/harmony/harmonicProgressions";

describe("Test AudiateBassLines quiz", () => { // put in mocks folder

  vi.mock("../src/logger/logTable", () => {
    const LogTableMock = vi.fn();
    (LogTableMock as any).write = vi.fn();

    return { LogTable: LogTableMock };
  });

  vi.mock("../src/midiplay", () => {
    return {
      play_midi: vi.fn(),
    };
  });

  vi.mock("../src/logger/logAsync", () => {
    const LogAsyncMock = vi.fn();
    (LogAsyncMock as any).questions_in_list_indexed = vi.fn();

    return { LogAsync: LogAsyncMock };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const quizHeadOutput = [
    [`Description: c1-1\n${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("Cb Major")}`],
    [`Description: c1-2\n${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("D Minor")}`],
    [`Description: c1-3\n${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("E# Minor")}`]
  ];

  const options = bassLineOptions.map(o =>  {
    return {name : o.name, options : o.options() }
  }) as TOptionsReturnType<typeof bassLineOptions>

  test.each([0, 1, 2])("should generate quiz head text", (mathFloorReturnValue: number) => {
    (<Mock>math_floor).mockReturnValue(mathFloorReturnValue);

    const quiz = new AudiateBassLines(options);
    expect(math_floor).toBeCalledTimes(3);
    expect(quiz.quiz_head).toEqual(quizHeadOutput[mathFloorReturnValue]);
  });

  const solfegeMelodies = [
    {
      melody: [
        { noteNames: ['Cb4'], duration: 1 },
        { noteNames: ['Fb3'], duration: 1 },
        { noteNames: ['Gb3'], duration: 1 },
        { noteNames: ['Cb4'], duration: 1 }
      ]
    },
    {
      melody: [
        { noteNames: ['D3'], duration: 1 },
        { noteNames: ['G3'], duration: 1 },
        { noteNames: ['A3'], duration: 1 },
        { noteNames: ['D3'], duration: 1 }
      ]
    },
    {
      melody: [
        { noteNames: ['E#3'], duration: 1 },
        { noteNames: ['A#3'], duration: 1 },
        { noteNames: ['B#3'], duration: 1 },
        { noteNames: ['E#3'], duration: 1 }
      ]
    },
  ];

  test.each([0, 1, 2])("should generate solfege degrees to LogTable", async (mathFloorReturnValue: number) => {
    (<Mock>math_floor).mockReturnValue(mathFloorReturnValue);
    (<Mock>LogTable.write).mockImplementation((solfege: SolfegeMelody) => {
      expect(solfege.getMelody).toEqual(solfegeMelodies[mathFloorReturnValue].melody);
    });
    const quiz = new AudiateBassLines(options);
    await quiz.execute();
    expect(LogTable.write).toBeCalledTimes(1);
  });
});
