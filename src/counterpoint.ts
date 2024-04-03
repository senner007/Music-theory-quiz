import fs from "fs";
import { TNoteAllAccidentalOctave } from "./utils";

export type TCounterpoint = Readonly<{
    cantus: Readonly<TNoteAllAccidentalOctave[]>;
    counterpoint: Readonly<TNoteAllAccidentalOctave[]>;
    description: string;
    isMajor: boolean;
    isDiatonic: boolean;
    isAbove: boolean;
    tags: string[];
  }>;
  
  type TCounterpointExamplesJSON = {
    level: number;
    description: string;
    examples: TCounterpoint[];
  };
  

const species1 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-baroque.json") as any) as TCounterpointExamplesJSON;

export const counterpointExamples = [
    species1
  ] as const;
  