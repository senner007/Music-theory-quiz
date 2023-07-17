import { TNoteAllAccidentalOctave } from "../utils";
import fs from "fs";
import { LogError } from "../dev-utils";
import { TRomanNumeralAbove, TRomanNumeral, romanNumeralsDict, to_roman_numeral } from "./romanNumerals";

export type TProgression = Readonly<{
  chords: Readonly<(TRomanNumeral | TRomanNumeralAbove)[]>;
  bass: Readonly<TNoteAllAccidentalOctave[]>;
  isMajor: boolean;
  isDiatonic: boolean;
  tags: string[];
  description: string;
  scale? : string;
  voiceLeading? :string[];

}>;

type TProgressionsJSON = {
  level: number;
  description: string;
  progressions: TProgression[];
};

const level_1 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions.json") as any) as TProgressionsJSON;
const level_2 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level2.json") as any) as TProgressionsJSON;
const level_3 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level3.json") as any) as TProgressionsJSON;
const level_5 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level5.json") as any) as TProgressionsJSON;
const level_6 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level6.json") as any) as TProgressionsJSON;
const level_circle_of_fifths = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-circle-of-fifths.json") as any) as TProgressionsJSON;
const level_circle_of_fifths_extended = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-circle-of-fifths-extended.json") as any) as TProgressionsJSON;
const level_30_common = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-common.json") as any) as TProgressionsJSON;
const level_40 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-wkh.json") as any) as TProgressionsJSON;
const level_50_common_jazz = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-common-jazz.json") as any) as TProgressionsJSON;
const level_70_jazz_walkup = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-jazz-walkup.json") as any) as TProgressionsJSON;

const experimental = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-experimental.json") as any) as TProgressionsJSON;

export const progressions = [
  level_1,
  level_2,
  level_3,
  level_5,
  level_6,
  level_circle_of_fifths,
  level_circle_of_fifths_extended,
  level_30_common,
  level_40,
  level_50_common_jazz,
  level_70_jazz_walkup,
  experimental
] as const;

// export function JSON_progressions_verify() {
//   const progressionsTemp: string[] = [];
//   const progressionsArray: TProgression[] = progressions.map(p => p.progressions).flat();
//   progressionsArray.forEach((key, keyIndex) => {
//     const chordsString = key.chords.join("") + key.bass.join("");
//     if (progressionsTemp.includes(chordsString)) {
//       LogError(
//         `Json content error at: 
// Description : ${key.description} progression : ${chordsString}
// Progression is not unique. Similar to progression at index: ${progressionsTemp.indexOf(chordsString)}`
//       );
//     }
//     progressionsTemp.push(chordsString);

//     key.chords.forEach((chord, chordIndex) => {
//       if (!(chord in romanNumeralsDict || to_roman_numeral(chord) in romanNumeralsDict)) {
//         LogError(
//           `Json content error at: 
// Index : ${chordIndex} chord : ${chord}
// Roman numeral not in dictionary`
//         );
//       }
//     });
//   });
// };
