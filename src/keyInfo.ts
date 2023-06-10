import { Chord } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";
import { TRomanNumeral } from "./harmony/romanNumerals";

export function key_info(key: MajorKey | MinorKey) {
  function getChords(chordQualities: readonly string[], scale: readonly string[]) {
    return chordQualities.map((q, index: number) => {
      return Chord.getChord(q, scale[index]);
    });
  }

  function chord_inversion(chords: IChord[], inversion: number) {
    return chords.map((c) => {
      return Chord.getChord(c.type, c.tonic!, c.notes[inversion]);
    });
  }

  function primary_chords_inversions(chordQualities: string[], romanNumerals: TRomanNumeral[], scale: readonly string[]) {
    const primaryChords = getChords(chordQualities, scale).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] };
    });

    function get_inversion(inversion: 1 | 2, identifier: "6" | "64") {
      return chord_inversion(primaryChords, inversion).map((c, index) => {
        let parts = romanNumerals[index].split("/");
        return { ...c, romanNumeral: 
          romanNumerals[index].includes("/") 
            ? parts[0] + identifier + "/" + parts[1] 
            : romanNumerals[index] + identifier 
          };
      });
    }

    const firstInversionChords = get_inversion(1, "6")
    const secondInversionChords = get_inversion(2, "64")

    return {
      primaryChords,
      firstInversionChords,
      secondInversionChords,
      allPrimaryChords: () => [...primaryChords, ...firstInversionChords, ...secondInversionChords],
    } as const;
  }

  function replace_symbol(romanNumeral: TRomanNumeral, from: string, to: string) {
    return romanNumeral.replace(from, to);
  }

  function seventh_chords_inversions<Type extends string>(seventhChordsSymbols: readonly string[], romanNumerals: TRomanNumeral[]) {
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
    const obj = {
      ...key,
      natural: {
        ...key.natural,
        ...primary_chords_inversions(["m", "dim", "M", "m", "m", "M", "M"], naturalNumerals, key.natural.scale),
        ...seventh_chords_inversions(key.natural.chords, naturalSevenths),
        secondaryDominants: primary_chords_inversions(["M", "M", "M", "M", "M", "M", "M"], naturalSecondaryDominants, key.natural.scale),
        secondaryDominantsSevenths: seventh_chords_inversions(key.natural.scale.map(n => Chord.getChord("7", n).symbol), naturalDecondaryDominantsSevenths)
      },
      harmonic: {
        ...key.harmonic,
        ...primary_chords_inversions(["m", "dim", "aug", "m", "M", "M", "dim"], harmonicNumerals, key.harmonic.scale),
        ...seventh_chords_inversions(key.harmonic.chords, harmonicSevenths),
      },
      melodic: {
        ...key.melodic,
        chords: melodicChords,
        ...primary_chords_inversions(["m", "m", "aug", "M", "M", "dim", "dim"], melodicNumerals, key.melodic.scale),
        ...seventh_chords_inversions(melodicChords, melodicSevenths),
      },
      
    } as const;
    return obj;
  }

  const majorNumerals: TRomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
  const majorSevenths: TRomanNumeral[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
  const secondaryDominants: TRomanNumeral[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
  const secondaryDominantSevenths: TRomanNumeral[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];
 

  const obj = {
    ...key,
    ...primary_chords_inversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    sevenths: seventh_chords_inversions(key.chords, majorSevenths),
    dominants: primary_chords_inversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
    dominantSevenths: seventh_chords_inversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
    additional: seventh_chords_inversions([Chord.getChord("m7", key.scale.at(-1)).symbol], ["vii7"])
  } as const;
  return obj;
}

export type KeyInfo = ReturnType<typeof key_info>;


function key_chords(keyInfo: KeyInfo) {
  if (keyInfo.type === "major") {
    return [
      ...keyInfo.allPrimaryChords(), 
      ...keyInfo.sevenths.allSevenths(), 
      ...keyInfo.dominants.allPrimaryChords(),
      ...keyInfo.dominantSevenths.allSevenths(), 
      ...keyInfo.additional.allSevenths()];
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

export function numeral_by_symbol(keyInfo: KeyInfo, chordNotes: string[]) {
  const chordSymbols: string[] = Chord.detect(chordNotes, { assumePerfectFifth: true });
  const keyChords = key_chords(keyInfo);
  const chordsFound = keyChords.filter(c => chordSymbols.includes(c.symbol)).remove_duplicate_objects().map(c => c.romanNumeral)
  return chordsFound.length > 1 ? chordsFound.join("|") : chordsFound.first_and_only();
}
