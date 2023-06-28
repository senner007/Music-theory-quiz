import { Chord } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";
import { TRomanNumeral } from "../harmony/romanNumerals";
import { key_info_minor } from "./minorkey";
import { key_info_major } from "./majorkey";

export type TChordQualities = "M" |  "m" | "dim" | "aug" | "sus4" | "m7"
export type TKeyInfo = ReturnType<typeof key_info_minor> | ReturnType<typeof key_info_major>;

function chords_from_qualities(chordQualities: readonly string[], scale: readonly string[]) {
  return chordQualities.map((q, index: number) => {
    return Chord.getChord(q, scale[index]);
  });
}

function chord_inversion(chords: IChord[], inversion: number) {
  return chords.map((c) => {
    return Chord.getChord(c.type, c.tonic!, c.notes[inversion]);
  });
}

export function primary_chords_and_inversions(chordQualities: TChordQualities[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
  const primaryChords = chords_from_qualities(chordQualities, scale).map((c, index) => {
    return { ...c, romanNumeral: romanNumerals[index] };
  });

  function inversions(inversion: 1 | 2, identifier: "6" | "64") {
    return chord_inversion(primaryChords, inversion).map((c, index) => {
      let parts = romanNumerals[index].split("/");
      return { ...c, romanNumeral: 
        romanNumerals[index].includes("/") 
          ? parts[0] + identifier + "/" + parts[1] 
          : romanNumerals[index] + identifier 
        };
    });
  }

  const firstInversionChords = inversions(1, "6")
  const secondInversionChords = inversions(2, "64")

  return {
    primaryChords,
    firstInversionChords,
    secondInversionChords,
    allPrimaryChords: () => [...primaryChords, ...firstInversionChords, ...secondInversionChords],
  } as const;
}

export function suspended_primary_chords(chordQualities: TChordQualities[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
  const primarySuspended = chords_from_qualities(chordQualities, scale).map((c, index) => {
    return { ...c, romanNumeral: romanNumerals[index] };
  });

  return {
    primarySuspended,
  } as const;
}

function replace_symbol(romanNumeral: TRomanNumeral, from: string, to: string) {
  return romanNumeral.replace(from, to);
}

export function seventh_chords_inversions(seventhChordsSymbols: string[], romanNumerals: TRomanNumeral[]) {
  const seventhChords = seventhChordsSymbols.map(c => Chord.get(c)).map((c, index) => {
    return { ...c, romanNumeral: romanNumerals[index] };
  });

  function seventh_inversions(inversion: 1 | 2 | 3, identifier: "65" | "43" | "42") {
    return chord_inversion(seventhChords, inversion).map((c, index) => {
      return { ...c, romanNumeral: replace_symbol(romanNumerals[index], "7", identifier) };
    });
  }

  const firstInversionChords = seventh_inversions(1, "65")
  const secondInversionChords = seventh_inversions(2, "43")
  const thirdInversionChords = seventh_inversions(3, "42")

  return {
    root: seventhChords,
    firstInversion: firstInversionChords,
    secondInversion: secondInversionChords,
    thirdInversion: thirdInversionChords,
    allSevenths: () => [...seventhChords, ...firstInversionChords, ...secondInversionChords, ...thirdInversionChords],
  } as const;
}

 export function keyinfo(key: MajorKey | MinorKey) {
  return key.type === "minor" ? key_info_minor(key) : key_info_major(key)
 }


function key_chords(keyInfo: TKeyInfo) {
  if (keyInfo.type === "major") {
    return [
      ...keyInfo.suspended.primarySuspended,
      ...keyInfo.allPrimaryChords(), 
      ...keyInfo.sevenths.allSevenths(), 
      ...keyInfo.dominants.allPrimaryChords(),
      ...keyInfo.dominantSevenths.allSevenths(), 
      ...keyInfo.additional.allSevenths(),
      ...keyInfo.other
    ];
  }

  return [
    ...keyInfo.natural.allPrimaryChords(),
    ...keyInfo.natural.allSevenths(),
    ...keyInfo.harmonic.allPrimaryChords(),
    ...keyInfo.harmonic.allSevenths(),
    ...keyInfo.melodic.allPrimaryChords(),
    ...keyInfo.melodic.allSevenths(),
    ...keyInfo.natural.secondaryDominants.allPrimaryChords(),
    ...keyInfo.natural.secondaryDominantsSevenths.allSevenths(),
  ];
}

export function numeral_by_symbol(keyInfo: TKeyInfo, chordNotes: string[]) {
  const chordSymbols: string[] = Chord.detect(chordNotes, { assumePerfectFifth: true });
  const keyChords = key_chords(keyInfo);
  const chordsFound = keyChords.filter(c => chordSymbols.includes(c.symbol)).remove_duplicate_objects().map(c => c.romanNumeral)
  return chordsFound.length > 1 ? chordsFound.join("|") : chordsFound.first_and_only();
}
