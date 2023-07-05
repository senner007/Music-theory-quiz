import { Chord } from "@tonaljs/tonal";
import { TRomanNumeral } from "../harmony/romanNumerals";
import { MajorKey } from "@tonaljs/key";
import { primary_chords_and_inversions, suspended_primary_chords, seventh_chords_inversions } from "./keyInfo";
import { TNoteAllAccidental } from "../utils";
import { get_chord, note_transpose } from "../tonal-interface";
import { ObjectEntries } from "../objectUtils";
import { TChordRomanNumeral } from "../quiz/audiateHarmony";

// This is needed when Chord.getChord fails
function getChordByDetect(notes: TNoteAllAccidental[], tonic: string, romanNumeral: TRomanNumeral) {
  return {
    symbol: Chord.detect(notes).first_and_only(), // abstract out Chord.detect
    romanNumeral: romanNumeral,
    aliases: [],
    tonic: tonic,
    notes: notes,
    type: "",
    intervals: [] // add test to ensure intervals always present
  }
}


export function key_info_major(key: MajorKey) {

  const majorNumerals: TRomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
  const majorSuspendedNumerals: TRomanNumeral[] = ["Isus4", "iisus4", "iiisus4", "IVsus4", "Vsus4", "visus4", "viisus4"];
  const majorSevenths: TRomanNumeral[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
  const secondaryDominants: TRomanNumeral[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
  const secondaryDominantSevenths: TRomanNumeral[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];

  const scale = key.scale as readonly TNoteAllAccidental[];

  const other: TChordRomanNumeral[] = [
    getChordByDetect([scale[6], scale[5], scale[0], scale[2]], scale[6], "via942"),
    { ...get_chord("dim", note_transpose(scale.at(0) as TNoteAllAccidental, "1A")), romanNumeral: "I#dim" },
    { ...get_chord("dim", note_transpose(scale.at(0) as TNoteAllAccidental, "1A"), scale[2]), romanNumeral: "I#6dim" },
    { ...get_chord("dim7", note_transpose(scale.at(1) as TNoteAllAccidental, "1A")), romanNumeral: "ii#dim7" },
    { ...get_chord("dim7", note_transpose(scale.at(5) as TNoteAllAccidental, "1A")), romanNumeral: "vi#dim7" },
    { ...get_chord("dim", scale.at_or_throw(2)), romanNumeral: "iiidim" },
    // add to test
  ]

  const additional = {
    "vii7": get_chord("m7", scale.at_or_throw(-1)).symbol,
    "v7": get_chord("m7", scale.at_or_throw(4)).symbol,
    "V7add6": get_chord("7add6", scale.at_or_throw(4)).symbol
  } as const

  return {
    ...primary_chords_and_inversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    keyInfo: { ...key, scale: scale },
    type: key.type,
    tonic: key.tonic,
    suspended: suspended_primary_chords(["sus4", "sus4", "sus4", "sus4", "sus4", "sus4", "sus4"], majorSuspendedNumerals, key.scale),
    sevenths: seventh_chords_inversions(key.chords, majorSevenths),
    secondaryMajor: primary_chords_and_inversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
    secondaryDominants: seventh_chords_inversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
    additional: seventh_chords_inversions(
      ObjectEntries(additional).values, ObjectEntries(additional).keys,
    ),
    other
  } as const;
}


