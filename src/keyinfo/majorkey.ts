import { Chord } from "@tonaljs/tonal";
import { TRomanNumeral } from "../harmony/romanNumerals";
import { MajorKey } from "@tonaljs/key";
import { primary_chords_and_inversions, suspended_primary_chords, seventh_chords_inversions } from "./keyInfo";
import { TNoteAllAccidental } from "../utils";
import { note_transpose } from "../tonal-interface";
import { ObjectEntries } from "../objectUtils";

export function key_info_major(key: MajorKey ) {

    const majorNumerals: TRomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
    const majorSuspendedNumerals: TRomanNumeral[] = ["Isus4", "iisus4", "iiisus4", "IVsus4", "Vsus4", "visus4", "viisus4"];
    const majorSevenths: TRomanNumeral[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
    const secondaryDominants: TRomanNumeral[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
    const secondaryDominantSevenths: TRomanNumeral[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];
  
    const other: { symbol : string, romanNumeral : TRomanNumeral}[] = [
      { symbol : Chord.detect([key.scale[6], key.scale[5], key.scale[0], key.scale[2]]).first_and_only(), romanNumeral : "via942" },
      { ...Chord.getChord("dim", note_transpose(key.scale.at(0) as TNoteAllAccidental, "1A")), romanNumeral : "I#dim" },
      { ...Chord.getChord("dim", note_transpose(key.scale.at(0) as TNoteAllAccidental, "1A"),  key.scale[2]), romanNumeral : "I#6dim" },
      { ...Chord.getChord("dim7", note_transpose(key.scale.at(1) as TNoteAllAccidental, "1A")), romanNumeral : "ii#dim7" },
      { ...Chord.getChord("dim7", note_transpose(key.scale.at(5) as TNoteAllAccidental, "1A")), romanNumeral : "vi#dim7" },
      { ...Chord.getChord("dim", key.scale.at(2)), romanNumeral : "iiidim" },
      // add to test - refactor
    ]

    const additional = {
      "vii7" : Chord.getChord("m7", key.scale.at(-1)).symbol,
      "v7" : Chord.getChord("m7", key.scale.at(4)).symbol,
      "V7add6" : Chord.getChord("7add6", key.scale.at(4)).symbol
    } as const
  
    return {
      ...key,
      ...primary_chords_and_inversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
      suspended : suspended_primary_chords(["sus4", "sus4", "sus4", "sus4", "sus4", "sus4", "sus4"], majorSuspendedNumerals, key.scale),
      sevenths: seventh_chords_inversions(key.chords, majorSevenths),
      dominants: primary_chords_and_inversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
      dominantSevenths: seventh_chords_inversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
      additional: seventh_chords_inversions(
        ObjectEntries(additional).values, ObjectEntries(additional).keys,
        ),
      other
    } as const;
  }


