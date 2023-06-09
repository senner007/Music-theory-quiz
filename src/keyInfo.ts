import { Chord } from "@tonaljs/tonal";
import { Chord as IChord } from "@tonaljs/chord";
import { MajorKey, MinorKey } from "@tonaljs/key";
import { RomanNumeralType } from "./harmonicProgressions";

export function keyInfo(key: MajorKey | MinorKey) {
  function getChords(chordQualities: readonly string[], scale: readonly string[]) {
    return chordQualities.map((q, index: number) => {
      return Chord.getChord(q, scale[index]);
    });
  }

  function InvChords(chords: IChord[], inversion: number) {
    return chords.map((c) => {
      return Chord.getChord(c.type, c.tonic!, c.notes[inversion]);
    });
  }

  function getPrimaryChordsInversions(chordQualities: string[], romanNumerals: RomanNumeralType[], scale: readonly string[]) {
    const primaryChords = getChords(chordQualities, scale).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] };
    });

    function getInversion(inversion: 1 | 2, identifier: "6" | "64") {
      return InvChords(primaryChords, inversion).map((c, index) => {
        let parts = romanNumerals[index].split("/");
        return { ...c, romanNumeral: 
          romanNumerals[index].includes("/") 
            ? parts[0] + identifier + "/" + parts[1] 
            : romanNumerals[index] + identifier 
          };
      });
    }

    const firstInversionChords = getInversion(1, "6")
    const secondInversionChords = getInversion(2, "64")

    return {
      primaryChords,
      firstInversionChords,
      secondInversionChords,
      allPrimaryChords: () => [...primaryChords, ...firstInversionChords, ...secondInversionChords],
    } as const;
  }

  function replaceSymbol(romanNumeral: RomanNumeralType, from: string, to: string) {
    return romanNumeral.replace(from, to);
  }

  function getSeventhChordsInversions<Type extends string>(seventhChordsSymbols: readonly string[], romanNumerals: RomanNumeralType[]) {
    const seventhChords = seventhChordsSymbols.map(c => Chord.get(c)).map((c, index) => {
      return { ...c, romanNumeral: romanNumerals[index] };
    });

    function getSeventhInversions(inversion: 1 | 2 | 3, identifier: "65" | "43" | "42") {
      return InvChords(seventhChords, inversion).map((c, index) => {
        return { ...c, romanNumeral: replaceSymbol(romanNumerals[index], "7", identifier) };
      });
    }

    const firstInversionChords = getSeventhInversions(1, "65")
    const secondInversionChords = getSeventhInversions(2, "43")
    const thirdInversionChords = getSeventhInversions(3, "42")

    return {
      root: seventhChords,
      firstInversion: firstInversionChords,
      secondInversion: secondInversionChords,
      thirdInversion: thirdInversionChords,
      allSevenths: () => [...seventhChords, ...firstInversionChords, ...secondInversionChords, ...thirdInversionChords],
    } as const;
  }


  if (key.type === "minor") {
    const naturalNumerals: RomanNumeralType[] = ["i", "iio", "bIII", "iv", "v", "bVI", "bVII"];
    const harmonicNumerals: RomanNumeralType[] = ["i", "iio", "bIII+", "iv", "V", "bVI", "viio"];
    const melodicNumerals: RomanNumeralType[] = ["i", "ii", "bIII+", "IV", "V", "vio", "viio"];

    const naturalSevenths: RomanNumeralType[] = ["i7", "iio7", "bIII7", "iv7", "v7", "bVI7", "bVII7"];
    const harmonicSevenths: RomanNumeralType[] = ["iM7", "iio7", "bIII+M7", "iv7", "V7", "bVIM7", "viio7"];
    const melodicSevenths: RomanNumeralType[] = ["iM7", "ii7", "bIII+M7", "IV7", "V7", "vio7", "viio7"];

    const naturalSecondaryDominants: RomanNumeralType[] = ["V/iv", "V/V", "bIII", "V/bVII", "V", "bVI", "bVII"];
    const naturalDecondaryDominantsSevenths: RomanNumeralType[] = ["V7/iv", "V7/V", "V7/bVI", "V7/bVII", "V7", "V7/bii", "bVII7"];

    // this chord is overriden since the library has this set to m6 chord and not mMaj7
    const melodicChords = [...key.melodic.chords] as string[];
    melodicChords[0] = key.melodic.tonic + "mMaj7";
    const obj = {
      ...key,
      natural: {
        ...key.natural,
        ...getPrimaryChordsInversions(["m", "dim", "M", "m", "m", "M", "M"], naturalNumerals, key.natural.scale),
        ...getSeventhChordsInversions(key.natural.chords, naturalSevenths),
        secondaryDominants: getPrimaryChordsInversions(["M", "M", "M", "M", "M", "M", "M"], naturalSecondaryDominants, key.natural.scale),
        secondaryDominantsSevenths: getSeventhChordsInversions(key.natural.scale.map(n => Chord.getChord("7", n).symbol), naturalDecondaryDominantsSevenths)
      },
      harmonic: {
        ...key.harmonic,
        ...getPrimaryChordsInversions(["m", "dim", "aug", "m", "M", "M", "dim"], harmonicNumerals, key.harmonic.scale),
        ...getSeventhChordsInversions(key.harmonic.chords, harmonicSevenths),
      },
      melodic: {
        ...key.melodic,
        chords: melodicChords,
        ...getPrimaryChordsInversions(["m", "m", "aug", "M", "M", "dim", "dim"], melodicNumerals, key.melodic.scale),
        ...getSeventhChordsInversions(melodicChords, melodicSevenths),
      },
      
    } as const;
    return obj;
  }

  const majorNumerals: RomanNumeralType[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
  const majorSevenths: RomanNumeralType[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
  const secondaryDominants: RomanNumeralType[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
  const secondaryDominantSevenths: RomanNumeralType[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];
 

  const obj = {
    ...key,
    ...getPrimaryChordsInversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    sevenths: getSeventhChordsInversions(key.chords, majorSevenths),
    dominants: getPrimaryChordsInversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
    dominantSevenths: getSeventhChordsInversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
    additional: getSeventhChordsInversions([Chord.getChord("m7", key.scale.at(-1)).symbol], ["vii7"])
  } as const;
  return obj;
}

export type KeyInfo = ReturnType<typeof keyInfo>;


function getKeyChords(keyInfo: KeyInfo) {
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

export function getNumeralBySymbol(keyInfo: KeyInfo, chordNotes: string[]) {
  const chordSymbols: string[] = Chord.detect(chordNotes, { assumePerfectFifth: true });
  const keyChords = getKeyChords(keyInfo);
  const chordsFound = keyChords.filter(c => chordSymbols.includes(c.symbol)).removeDuplicateObjects().map(c => c.romanNumeral)
  return chordsFound.length > 1 ? chordsFound.join("|") : chordsFound.firstAndOnly();
}
