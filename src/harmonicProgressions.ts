import { noteAllAccidentalOctave } from "./utils";
import fs from "fs";
import { LogError } from "./dev-utils";
import { Note } from "@tonaljs/tonal";

export enum IntervalDistance {
  OctaveUp = "8P",
  OctaveDown = "-8P",
}

export function romanNumeralChord(romanNumeral: RomanNumeralType | RomanNumeralAbove) {
  if (romanNumeral.includes("-a")) {
    const basicRomanNumeral: RomanNumeralType = to_roman_numeral(romanNumeral as RomanNumeralAbove);
    return to_actave_above(romanNumeralsDict[basicRomanNumeral]);
  }
  return romanNumeralsDict[romanNumeral as RomanNumeralType];
}

type dict = Record<string, noteAllAccidentalOctave[]>;

// TODO : split into base and sevenths types
const romanNumeralsDict = {
  i: ["C4", "Eb4", "G4"],
  i6: ["Eb4", "G4", "C5"],
  i64: ["G4", "C5", "Eb5"],
  iM7: ["C4", "Eb4", "G4", "B4"],
  i7: [],
  I: ["C4", "E4", "G4"],
  I6: ["E4", "G4", "C5"],
  I64: ["G4", "C5", "E5"],
  I7: [],
  "V7/IV" : ["C4", "Eb4", "G4", "Bb4"],
  V: ["G4", "B4", "D5"],
  V64: ["D4", "G4", "B4"],
  V7: ["G4", "B4", "D5", "F5"],
  V7no5: ["G4", "B4", "F5"],
  V742no5: ["F4", "G4", "B4"],
  V6: ["B3", "D4", "G4"],
  V65: ["B4", "D5", "F5", "G5"],
  v : [],
  v7 : [],
  ii: ["D4", "F4", "A4"],
  ii7 : [],
  iio: ["D4", "F4", "Ab4"],
  iio7 : [],
  iio6: ["F4", "Ab4", "D5"],
  iio64: ["Ab4", "D5", "F5"],
  ii6: ["F4", "A4", "D5"],
  ii64: ["A4", "D5", "F5"],
  "V7/V": ["D4", "F#4", "A4", "C5"],
  "V65/V": ["F#4", "A4", "C5", "D5"],
  iii: ["E4", "G4", "B4"],
  iii6: ["G4", "B4", "E5"],
  iii64: ["B4", "E5", "G5"],
  iii7 : [],
  bIII : ["Eb4", "G4", "Bb4"],
  bIII6 : ["G4", "Bb4", "Eb5"],
  bIII7 : [],
  "bIII+" : [],
  "bIII+M7" : [],
  "V7/vi" : ["E4", "G#4", "B4", "D5"],
  "V65/vi" : ["G#4", "B4", "D5", "E5"],
  iv: ["F4", "Ab4", "C5"],
  iv6: ["Ab4", "C5", "F5"],
  iv64: ["C4", "F4", "Ab4"],
  iv7 : [],
  IV: ["F4", "A4", "C5"],
  IV6: ["A4", "C5", "F5"],
  IV64: ["C4", "F4", "A4"],
  IV7 : [],
  vi: ["A4", "C5", "E5"],
  vi6: ["C4", "E4", "A4"],
  vi64: ["E4", "A4", "C5"],
  vi42no5: ["G4", "A4", "C5"],
  vi7 : [],
  vio : [],
  vio7 : [],
  bVI: ["Ab4", "C5", "Eb5"],
  bVI6: ["C4", "Eb4", "Ab4"],
  bVI64: ["Eb4", "Ab4", "C5"],
  bVIM7: [],
  bVI7: [],
  "V7/ii" : ["A4", "C#5", "E5", "G5"],
  viio: ["B4", "D5", "F5"],
  viio64: ["F4", "B4", "D5"],
  viio6: ["D4", "F4", "B4"],
  viio7 : [],
  vii42no5: ["A4", "B4", "D5"],
  bVII : ["Bb4", "D5", "F5"],
  bVII6 : ["D4", "F4", "Bb4"],
  bVII7 : [],
  "V7/iii" : ["B4", "D#5", "F#5", "A5"]
} satisfies dict;

export type RomanNumeralType = keyof typeof romanNumeralsDict;

export type RomanNumeralAbove = `${RomanNumeralType}-a`;

function to_actave_above(notes: Readonly<noteAllAccidentalOctave[]>): noteAllAccidentalOctave[] {
  return notes.map((n) => Note.transpose(n, IntervalDistance.OctaveUp)) as noteAllAccidentalOctave[];
}

export function to_roman_numeral(romanNumeral: RomanNumeralType | RomanNumeralAbove): RomanNumeralType {
  return romanNumeral.replace(/-a/g, "") as RomanNumeralType;
}

export type Progression = Readonly<{
  chords: Readonly<(RomanNumeralType | RomanNumeralAbove)[]>;
  bass: Readonly<noteAllAccidentalOctave[]>;
  isMajor: boolean;
  description?: string;
  isDiatonic: boolean;
  tags: string[];
}>;

type ProgressionsJSON = {
  level: number;
  description: string;
  progressions: Progression[];
};

const level_1 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions.json") as any) as ProgressionsJSON;
const level_2 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level2.json") as any) as ProgressionsJSON;
const level_3 = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-level3.json") as any) as ProgressionsJSON;

const level_circle_of_fifths = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-circle-of-fifths.json") as any) as ProgressionsJSON;
const level_circle_of_fifths_extended = JSON.parse(fs.readFileSync("src/progressions/harmonic-progressions-circle-of-fifths-extended.json") as any) as ProgressionsJSON;

export const progressions = [
  ...level_1.progressions,
  ...level_2.progressions,
  ...level_3.progressions,
  ...level_circle_of_fifths.progressions,
  ...level_circle_of_fifths_extended.progressions
];

(function JSONContentVerify() {
  const progressionsTemp: string[] = [];
  progressions.forEach((key, keyIndex) => {
    const chordsString = key.chords.join("") + key.bass.join("");
    if (progressionsTemp.includes(chordsString)) {
      LogError(
        `Json content error at: 
Description : ${key.description} progression : ${chordsString}
Progression is not unique. Similar to progression at index: ${progressionsTemp.indexOf(chordsString)}`
      );
    }
    progressionsTemp.push(chordsString);

    key.chords.forEach((chord, chordIndex) => {
      if (!(chord in romanNumeralsDict || to_roman_numeral(chord) in romanNumeralsDict)) {
        LogError(
          `Json content error at: 
Index : ${chordIndex} chord : ${chord}
Roman numeral not in dictionary`
        );
      }
    });
  });
})();
