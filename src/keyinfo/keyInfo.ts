import { Chord } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";
import { TRomanNumeral } from "../harmony/romanNumerals";

type TChordQualities = "M" |  "m" | "dim" | "aug" | "sus4" | "m7"

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

function primary_chords_and_inversions(chordQualities: TChordQualities[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
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

function suspended_primary_chords(chordQualities: TChordQualities[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
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

function seventh_chords_inversions(seventhChordsSymbols: string[], romanNumerals: TRomanNumeral[]) {
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

export function key_info(key: MajorKey | MinorKey) {

  if (key.type === "minor") {
    const naturalNumerals: TRomanNumeral[] = ["i", "iio", "bIII", "iv", "v", "bVI", "bVII"];
    const harmonicNumerals: TRomanNumeral[] = ["i", "iio", "bIII+", "iv", "V", "bVI", "viio"];
    const melodicNumerals: TRomanNumeral[] = ["i", "ii", "bIII+", "IV", "V", "vio", "viio"];

    const naturalSevenths: TRomanNumeral[] = ["i7", "iio7", "bIII7", "iv7", "v7", "bVI7", "bVII7"];
    const harmonicSevenths: TRomanNumeral[] = ["iM7", "iio7", "bIII+M7", "iv7", "V7", "bVIM7", "viio7"];
    const melodicSevenths: TRomanNumeral[] = ["iM7", "ii7", "bIII+M7", "IV7", "V7", "vio7", "viio7"];

    const naturalSecondaryDominants: TRomanNumeral[] = ["V/iv", "V/V", "bIII", "V/bVII", "V", "bVI", "bVII"];
    const naturalDecondaryDominantsSevenths: TRomanNumeral[] = ["V7/iv", "V7/V", "V7/bVI", "V7/bVII", "V7", "V7/bii", "bVII7"];

    // this chord is overriden since the library has this set to m6 chord and not mMaj7
    const melodicChords = [...key.melodic.chords] as string[];
    melodicChords[0] = key.melodic.tonic + "mMaj7";
    return {
      ...key,
      natural: {
        ...key.natural,
        ...primary_chords_and_inversions(["m", "dim", "M", "m", "m", "M", "M"], naturalNumerals, key.natural.scale),
        ...seventh_chords_inversions(key.natural.chords as TChordQualities[], naturalSevenths),
        secondaryDominants: primary_chords_and_inversions(["M", "M", "M", "M", "M", "M", "M"], naturalSecondaryDominants, key.natural.scale),
        secondaryDominantsSevenths: seventh_chords_inversions(key.natural.scale.map(n => Chord.getChord("7", n).symbol), naturalDecondaryDominantsSevenths)
      },
      harmonic: {
        ...key.harmonic,
        ...primary_chords_and_inversions(["m", "dim", "aug", "m", "M", "M", "dim"], harmonicNumerals, key.harmonic.scale),
        ...seventh_chords_inversions(key.harmonic.chords as TChordQualities[], harmonicSevenths),
      },
      melodic: {
        ...key.melodic,
        chords: melodicChords,
        ...primary_chords_and_inversions(["m", "m", "aug", "M", "M", "dim", "dim"], melodicNumerals, key.melodic.scale),
        ...seventh_chords_inversions(melodicChords, melodicSevenths),
      },
      
    } as const;
  }

  const majorNumerals: TRomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
  const majorSuspendedNumerals: TRomanNumeral[] = ["Isus4", "iisus4", "iiisus4", "IVsus4", "Vsus4", "visus4", "viisus4"];
  const majorSevenths: TRomanNumeral[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
  const secondaryDominants: TRomanNumeral[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
  const secondaryDominantSevenths: TRomanNumeral[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];

  const other = [
    { symbol : Chord.detect([key.scale[6], key.scale[5], key.scale[0], key.scale[2]]).first_and_only(), romanNumeral : "via942" } 
    // add to test - refactor
  ]

  return {
    ...key,
    ...primary_chords_and_inversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    suspended : suspended_primary_chords(["sus4", "sus4", "sus4", "sus4", "sus4", "sus4", "sus4"], majorSuspendedNumerals, key.scale),
    sevenths: seventh_chords_inversions(key.chords, majorSevenths),
    dominants: primary_chords_and_inversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
    dominantSevenths: seventh_chords_inversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
    additional: seventh_chords_inversions([Chord.getChord("m7", key.scale.at(-1)).symbol], ["vii7"]),
    other
  } as const;
}

export type TKeyInfo = ReturnType<typeof key_info>;


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
