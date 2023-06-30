import { TNoteAllAccidentalOctave } from "../utils";
import { to_octave_above } from "../tonal-interface";

type TRomanNumeralDict = Record<string, TNoteAllAccidentalOctave[]>;

export type TRomanNumeral = keyof typeof romanNumeralsDict;

export type TRomanNumeralAbove = `${TRomanNumeral}-a`;

// TODO : split into base and sevenths types
export const romanNumeralsDict = {
  i: ["C4", "Eb4", "G4"],
  i6: ["Eb4", "G4", "C5"],
  i64: ["G4", "C5", "Eb5"],
  iM7: ["C4", "Eb4", "G4", "B4"],
  i7: [],
  I: ["C4", "E4", "G4"],
  I6: ["E4", "G4", "C5"],
  I64: ["G4", "C5", "E5"],
  Isus4: ["C4", "F4", "G4"],
  I7: [],
  "V/iv": ["C4", "E4", "G4"],
  "V7/iv": ["C4", "E4", "G4", "Bb4"],
  "V7/IV": ["C4", "E4", "G4", "Bb4"],
  V: ["G4", "B4", "D5"],
  V64: ["D4", "G4", "B4"],
  V7: ["G4", "B4", "D5", "F5"],
  V7no5: ["G4", "B4", "F5"],
  V42no5: ["F4", "G4", "B4"],
  V6: ["B3", "D4", "G4"],
  V43no1: ["D4", "F4", "B4"],
  Vsus4: ["G4", "C4", "D5"],
  v: [],
  v7: [],
  ii: ["D4", "F4", "A4"],
  ii7: [],
  ii65no3: ["A4", "C5", "D5"],
  iio: ["D4", "F4", "Ab4"],
  iio7: [],
  iio6: ["F4", "Ab4", "D5"],
  iio64: ["Ab4", "D5", "F5"],
  ii6: ["F4", "A4", "D5"],
  ii64: ["A4", "D5", "F5"],
  ii6no3: ["A4", "D5"],
  iino3double1: ["D4", "A4", "D5"],
  iisus4: ["D4", "G4", "A4"],
  "V/V": ["D4", "F#4", "A4"],
  "V7/V": ["D4", "F#4", "A4", "C5"],
  "V7no5/V": ["D4", "F#4", "C5"],
  "V65/V": ["F#4", "A4", "C5", "D5"],
  iii: ["E4", "G4", "B4"],
  iii6: ["G4", "B4", "E5"],
  iii64: ["B4", "E5", "G5"],
  iiisus4: ["E4", "A4", "B4"],
  iii7: [],
  bIII: ["Eb4", "G4", "Bb4"],
  bIII6: ["G4", "Bb4", "Eb5"],
  bIII7: [],
  "bIII+": [],
  "bIII+M7": [],
  "V7/bVI": ["Eb4", "G4", "Bb4", "Db5"],
  "V/vi": ["E4", "G#4", "B4"],
  "V7/vi": ["E4", "G#4", "B4", "D5"],
  "V65/vi": ["G#4", "B4", "D5", "E5"],
  "V43no5/vi": ["D4", "E4", "G#4"],
  iv: ["F4", "Ab4", "C5"],
  iv6: ["Ab4", "C5", "F5"],
  iv64: ["C4", "F4", "Ab4"],
  iv7: [],
  IV: ["F4", "A4", "C5"],
  IV6: ["A4", "C5", "F5"],
  IV6no3: ["C5", "F5"],
  IV64: ["C4", "F4", "A4"],
  IVsus4: ["F4", "Bb4", "C5"],
  IV7: [],
  vi: ["A4", "C5", "E5"],
  vi6: ["C4", "E4", "A4"],
  vi64: ["E4", "A4", "C5"],
  visus4: ["A4", "D5", "E5"],
  vi42no5: ["G4", "A4", "C5"],
  "vi/add9": [],
  vi7: [],
  vio: [],
  vio7: [],
  VI64: ["E4", "A4", "C#5"],
  bVI: ["Ab4", "C5", "Eb5"],
  bVI6: ["C4", "Eb4", "Ab4"],
  bVI64: ["Eb4", "Ab4", "C5"],
  bVIM7: [],
  bVI7: [],
  "V/ii": ["A4", "C#5", "E5"],
  "V7/ii": ["A4", "C#5", "E5", "G5"],
  "V7/bii": ["Ab4", "C5", "Eb5", "Gb5"],
  viio: ["B4", "D5", "F5"],
  viio6: ["D4", "F4", "B4"],
  viio64: ["F4", "B4", "D5"],
  viisus4: ["B4", "E5", "F#5"],
  viio7: [],
  vii7: ["B4", "D5", "F5", "A5"],
  vii42no5: ["A4", "B4", "D5"],
  bVII: ["Bb4", "D5", "F5"],
  bVII6: ["D4", "F4", "Bb4"],
  bVII64: ["F4", "Bb4", "D5"],
  bVII7: [],
  "V/bVII": ["F4", "A4", "C5"],
  "V7/bVII": ["F4", "A4", "C5", "Eb5"],
  "V/iii": ["B4", "D#5", "F#5"],
  "V7/iii": ["B4", "D#5", "F#5", "A5"]
} satisfies TRomanNumeralDict;

export function romanNumeralChord(romanNumeral: TRomanNumeral | TRomanNumeralAbove) {
  if (romanNumeral.includes("-a")) {
    const basicRomanNumeral: TRomanNumeral = to_roman_numeral(romanNumeral as TRomanNumeralAbove);
    return to_octave_above(romanNumeralsDict[basicRomanNumeral]);
  }
  return romanNumeralsDict[romanNumeral as TRomanNumeral];
}

export function to_roman_numeral(romanNumeral: TRomanNumeral | TRomanNumeralAbove): TRomanNumeral {
  return romanNumeral.replace(/-a/g, "") as TRomanNumeral;
}