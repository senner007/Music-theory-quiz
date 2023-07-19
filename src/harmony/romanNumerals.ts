import { TNoteAllAccidentalOctave } from "../utils";
import { to_octave_above } from "../tonal-interface";
import { IProgression } from "../transposition";
import { TKeyInfo, chords_by_chordNotes, resolveAmbiguousChords } from "../keyinfo/keyInfo";
import { LogError } from "../dev-utils";

type TRomanNumeralDict = Record<string, readonly TNoteAllAccidentalOctave[]>;

export type TRomanNumeral = keyof typeof romanNumeralsDict;

export type TRomanNumeralAbove = `${TRomanNumeral}-a`;

// TODO : split into base and sevenths types
const romanNumeralsDict = {
  i: ["C4", "Eb4", "G4"],
  i6: ["Eb4", "G4", "C5"],
  i64: ["G4", "C5", "Eb5"],
  iM7: ["C4", "Eb4", "G4", "B4"],
  i7: [],
  I: ["C4", "E4", "G4"],
  Idouble1no3: ["C4", "G4", "C5"],
  I6: ["E4", "G4", "C5"],
  I64: ["G4", "C5", "E5"],
  I64double5no3: ["G4", "C5", "G5"],
  Isus4: ["C4", "F4", "G4"],
  I7: [],
  I7no1: ["E4", "G4", "B4"],
  "I43no1" : ["G4", "B4", "E5"],
  "I42no1" : ["B3", "E4", "G4"],
  I7dom : [ ],
  "I#dim" : ["C#4", "E4", "G4"],
  "I#6dim" : ["E4", "G4", "C#5"],
  bV7dom : [],
  "V/iv": ["C4", "E4", "G4"],
  "V7/iv": ["C4", "E4", "G4", "Bb4"],
  "V7/IV": [],
  "V7no1/IV": ["E4", "G4", "Bb4"], // wrong name
  "I65domno1": ["E4", "G4", "Bb4"],
  "I43domno1": ["G4", "Bb4", "E5"],
  "V65no5/IV": ["E4", "Bb4", "C5"],
  "V743no1/IV" : ["G4", "Bb4", "E5"],
  V: ["G4", "B4", "D5"],
  V6: ["B3", "D4", "G4"],
  V64: ["D4", "G4", "B4"],
  V64no3double5: ["D4", "G4", "D5"],
  V7: ["G4", "B4", "D5", "F5"],
  V7no1 : ["B4", "D5", "F5"],
  V7no5: ["G4", "B4", "F5"],
  V65no5 : ["B3", "F4", "G4"],
  V43no3 : ["D4", "F4", "G4"],
  V43no3wide : ["G3", "D4", "F4"],
  V42no5: ["F4", "G4", "B4"],
  V42no3 : ["F4", "G4", "D5"],
  V42no1: ["F4", "B4", "D5"],
  V7add6 : [],
  "V7add6no5no9no1(3rdInv)" : ["F4", "B4", "E5"],
  V43no1: ["D4", "F4", "B4"],
  Vsus4: ["D4", "G4", "C5"],
  V7b5 : ["G4", "B4", "Db5", "F5"],
  v: [],
  v7: ["G4", "Bb4", "D5", "F5"],
  "v43" : ["D4", "F4", "G4", "Bb4"],
  "v743no1" : ["D4", "F4", "Bb4"], // wrong name
  ii: ["D4", "F4", "A4"],
  ii7 : [],
  ii7no5: ["D4", "F4", "C5"],
  ii7no3: ["D4", "A4", "C5"],
  ii43: ["A4", "C5", "D5", "F5"],
  ii65no3: ["A4", "C5", "D5"], // wrong name
  ii65no5: ["F4", "C5", "D5"],
  ii43no1: ["A4", "C5", "F5"],
  iio: ["D4", "F4", "Ab4"],
  iio7: [],
  iio6: ["F4", "Ab4", "D5"],
  iio64: ["Ab4", "D5", "F5"],
  iio7no3: ["D4", "Ab4", "C5"],
  ii6: ["F4", "A4", "D5"],
  ii64: ["A4", "D5", "F5"],
  ii6no3: ["A4", "D5"],
  iino3double1: ["D4", "A4", "D5"],
  iisus4: ["D4", "G4", "A4"],
  "ii#dim7" : ["D#4", "F#4", "A4", "C5"],
  "V/V": ["D4", "F#4", "A4"],
  "V7/V": ["D4", "F#4", "A4", "C5"],
  "V7no3/V": ["D4", "A4", "C5"],
  "V7no5/V": ["D4", "F#4", "C5"],
  "V7no1/V": ["C4", "F#4", "A4"],
  "V65/V": ["F#4", "A4", "C5", "D5"],

  bIII7dom : [],
  iii: ["E4", "G4", "B4"],
  iii6: ["G4", "B4", "E5"],
  iii64: ["B4", "E5", "G5"],
  iiisus4: ["E4", "A4", "B4"],
  iii7: [],
  iiidim: ["E4", "G4", "Bb4"],
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
  IVno3: ["F4", "C5"],
  IV6: ["A4", "C5", "F5"],
  IV6no3: ["C5", "F5"],
  IV64: ["C4", "F4", "A4"],
  IVsus4: ["F4", "Bb4", "C5"],
  IV7: ["F4", "A4", "C5", "E5"],
  IV7no1 : ["A4", "C5", "E5"],
  IV743no1: ["C4", "E4", "A4"],
  "IV#dim" : ["F#4", "A4", "C5"],
  IV7dom : ["F4", "A4", "C5", "Eb5"],
  IV42domno1 : ["Eb4", "A4", "C5"],
  IV42domno5 : ["F4", "A4", "Eb5"],
  vi: ["A4", "C5", "E5"],
  vi6: ["C4", "E4", "A4"],
  vi64: ["E4", "A4", "C5"],
  visus4: ["A4", "D5", "E5"],
  vi42no5: ["G4", "A4", "C5"],
  "vi/add9": [],
  "via942" : [],
  vi7: [],
  vio: [],
  vio7: [],
  "vi#dim7" : ["Bb4", "Db5", "Fb5", "G5"],
  VI64: ["E4", "A4", "C#5"],
  VI7no5: ["A4", "C#5", "G5"],
  bVI: ["Ab4", "C5", "Eb5"],
  bVI6: ["C4", "Eb4", "Ab4"],
  bVI64: ["Eb4", "Ab4", "C5"],
  bVIM7: [],
  bVI7: [],
  bVI7dom : [],
  bIV7b5 : [],
  vidim7: ["A4", "C5", "Eb5", "Gb5"],
  "vidim7no5" : ["A4", "C5", "Gb5"],
  "V/ii": ["A4", "C#5", "E5"],
  "V7/ii": ["A4", "C#5", "E5", "G5"],
  "V42no1/ii": ["G4", "C#5", "E5"],
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
  bVII7dom : [],
  "V/bVII": ["F4", "A4", "C5"],
  "V7/bVII": ["F4", "A4", "C5", "Eb5"],
  "V/iii": ["B4", "D#5", "F#5"],
  "V7/iii": ["B4", "D#5", "F#5", "A5"]
} as const satisfies TRomanNumeralDict

class RomanNumeralDictionary {
  private readonly romanNumerals = romanNumeralsDict;

  private to_roman_numeral(romanNumeral: TRomanNumeralAbove): TRomanNumeral {
    return romanNumeral.replace(/-a/g, "") as TRomanNumeral;
  }

  private octave_roman_numeral (roamnNumeralOctave : TRomanNumeralAbove) {
    const romanNumeralNoOctave: TRomanNumeral = this.to_roman_numeral(roamnNumeralOctave);
    return to_octave_above(this.romanNumerals[romanNumeralNoOctave]);
  }

  notes(romanNumeral : TRomanNumeral | TRomanNumeralAbove) {

    let chord;
    if (romanNumeral.includes("-a")) {
      chord = this.octave_roman_numeral(romanNumeral as TRomanNumeralAbove)
    } else {
      chord = this.romanNumerals[romanNumeral as TRomanNumeral];
    }

    if (chord === undefined) {
      LogError(`Roman numeral: ${romanNumeral} does not exist in dictionary`)
    }

    return chord;
  }
}

export const romanNueralDict = new RomanNumeralDictionary();

export function progression_to_chords(progression : IProgression, keyInfo : TKeyInfo, scaletype? : string) {
  return progression
      .chords
      .map((n, index: number) => {
      try {
        const chords = chords_by_chordNotes(keyInfo, [progression.bass[index], ...n])
        const chord = resolveAmbiguousChords(chords, keyInfo, [progression.bass[index], ...n], progression, scaletype)
        return chord;
      } catch (error) {
        const errorMessage = `Error obtaining roman numeral at chord index ${index}`
        LogError(`${(error as Error).message}\n${errorMessage}`)
      }
    });
}