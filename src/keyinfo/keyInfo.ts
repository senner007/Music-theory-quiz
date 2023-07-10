import { Chord } from "@tonaljs/tonal";
import { MajorKey, MinorKey } from "@tonaljs/key";
import { TRomanNumeral } from "../harmony/romanNumerals";
import { key_info_minor } from "./minorkey";
import { key_info_major } from "./majorkey";
import { LogError } from "../dev-utils";
import { get_chord, get_chord_by_symbol } from "../tonal-interface";
import { TChord, TChordRomanNumeral } from "../quiz/audiateHarmony";
import { IProgression } from "../transposition";

export type TChordQualities = "M" | "m" | "dim" | "aug" | "sus4" | "m7"
export type TKeyInfo = ReturnType<typeof key_info_minor> | ReturnType<typeof key_info_major>;

function chords_from_qualities(chordQualities: readonly string[], scale: readonly string[]) {
  return chordQualities.map((q, index: number) => {
    return get_chord(q, scale[index]);
  });
}

function chord_inversions(chords: TChord[], inversion: number) {
  return chords.map((c) => {
    return chord_inversion(c, inversion);
  });
}

function chord_inversion(chord: TChord, inversion: number): TChord {
 const type = chord.type === "" || chord.type === undefined ? chord.aliases.first() : chord.type; 
  return get_chord(type, chord.tonic, chord.notes[inversion]);
} 

function secondaryDominantAlias(chords : TChordRomanNumeral[] ) {
  return chords.map(c => {
    const isSecondary = c.romanNumeral.includes("/")
    return {...c, aliases : isSecondary ? [...c.aliases, "secDom"] : c.aliases  }
  })
}



export function primary_chords_and_inversions(chordQualities: TChordQualities[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
  const primaryChords = chords_from_qualities(chordQualities, scale).map((c, index) => {
    return { ...c, romanNumeral: romanNumerals[index] }
  });

  function inversions(inversion: 1 | 2, identifier: "6" | "64") {
    return chord_inversions(primaryChords, inversion).map((c, index) => {
      let parts = romanNumerals[index].split("/");
      return {
        ...c, romanNumeral:
          romanNumerals[index].includes("/")
            ? parts[0] + identifier + "/" + parts[1]
            : romanNumerals[index] + identifier
      };
    });
  }

  const firstInversionChords = inversions(1, "6");
  const secondInversionChords = inversions(2, "64");

  const allPrimary = [...primaryChords, ...firstInversionChords, ...secondInversionChords];

  const allPrimarySecondayAlias = secondaryDominantAlias(allPrimary);

  return {
    allPrimaryChords: () => allPrimarySecondayAlias,
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
  const seventhChords = seventhChordsSymbols
    .map(c => get_chord_by_symbol(c))
    .map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] };
    });

  function seventh_inversions(inversion: 1 | 2 | 3, identifier: "65" | "43" | "42") {
    return chord_inversions(seventhChords, inversion)
      .map((c, index) => {
        return { ...c, romanNumeral: replace_symbol(romanNumerals[index], "7", identifier) };
    });
  }

  const firstInversionChords = seventh_inversions(1, "65")
  const secondInversionChords = seventh_inversions(2, "43")
  const thirdInversionChords = seventh_inversions(3, "42")

  const allSevenths = [...seventhChords, ...firstInversionChords, ...secondInversionChords, ...thirdInversionChords];

  const secondarySeventhsAlias = secondaryDominantAlias(allSevenths)

  return {
    allSevenths: () => secondarySeventhsAlias,
  } as const;
}

export function keyinfo(key: MajorKey | MinorKey) {
  return key.type === "minor" ? key_info_minor(key) : key_info_major(key)
}

export function key_chords(keyInfo: TKeyInfo) {
  if (keyInfo.type === "major") {
    return [
      ...keyInfo.suspended.primarySuspended,
      ...keyInfo.allPrimaryChords(),
      ...keyInfo.sevenths.allSevenths(),
      ...keyInfo.secondaryMajor.allPrimaryChords(),
      ...keyInfo.secondaryDominants.allSevenths(),
      ...keyInfo.additional.allSevenths(),
      ...keyInfo.other
    ]
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
  ]
}

export function chords_by_chordNotes(keyInfo: TKeyInfo, chordNotes: string[]) {
  const chordSymbols: string[] = Chord.detect(chordNotes, { assumePerfectFifth: true });
  const keyChords = key_chords(keyInfo);
  const chordsFoundInKey = keyChords.filter(c => chordSymbols.includes(c.symbol)).remove_duplicate_objects()
  if (chordsFoundInKey.is_empty()) {
    LogError(`Chord not found in ${keyInfo.type} key of ${keyInfo.tonic} for symbol(s) : ${chordSymbols.toString()}`) 
  }
  return chordsFoundInKey
}

export function numeral_by_chordNotes(keyInfo: TKeyInfo, chordNotes: string[]) {
  const chords = chords_by_chordNotes(keyInfo, chordNotes)
  return chords.length > 1 ? chords.map(c => c.romanNumeral).join("|") : chords.first_and_only().romanNumeral;
}

export function resolveAmbiguousChords(chords : TChordRomanNumeral[], keyInfo : TKeyInfo, chordNotes: string[], progression : IProgression) {
  // add advanced logic here to resolve issue when chord functions are ambiguous
  // example ["F", "A", "C", "Eb"] i C minor melodic could equal IV7 or V7/bVII depending on the surrounding context;
  // pending implementation return first item
  return chords.first();
}