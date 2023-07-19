import { Chord } from "@tonaljs/tonal";
import { TRomanNumeral } from "../harmony/romanNumerals";
import { MajorKey } from "@tonaljs/key";
import { primary_chords_and_inversions, suspended_primary_chords, seventh_chords_inversions } from "./keyInfo";
import { EScaleSteps, TNoteAllAccidental } from "../utils";
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
    intervals: [], // add test to ensure intervals always present
    quality : "Unknown" as const, // Fix - should not be unknown
    type: "",
  }
}

export function key_info_major(key: MajorKey) {

  const majorNumerals: TRomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi", "viio"];
  const majorSuspendedNumerals: TRomanNumeral[] = ["Isus4", "iisus4", "iiisus4", "IVsus4", "Vsus4", "visus4", "viisus4"];
  const majorSevenths: TRomanNumeral[] = ["I7", "ii7", "iii7", "IV7", "V7", "vi7", "viio7"];
  const secondaryDominants: TRomanNumeral[] = ["I", "V/V", "V/vi", "IV", "V", "V/ii", "V/iii"];
  const secondaryDominantSevenths: TRomanNumeral[] = ["V7/ii", "V7/iii", "V7/IV", "V7/V", "V7/vi"];
  const substituteDominantSevenths: TRomanNumeral[] = ["I7dom", "bIII7dom", "IV7dom", "bV7dom", "bVI7dom", "bVII7dom"];

  const scale = key.scale as readonly TNoteAllAccidental[];

  const other: TChordRomanNumeral[] = [
    getChordByDetect([scale[EScaleSteps.Leading], scale[EScaleSteps.SubMediant], scale[EScaleSteps.Tonic], scale[EScaleSteps.Mediant]], scale[EScaleSteps.Leading], "via942"),
    { ...get_chord("dim", note_transpose(scale.at_or_throw(EScaleSteps.Tonic), "1A")), romanNumeral: "I#dim" },
    { ...get_chord("dim", note_transpose(scale.at_or_throw(EScaleSteps.Tonic), "1A"), scale[EScaleSteps.Mediant]), romanNumeral: "I#6dim" },
    { ...get_chord("dim7", note_transpose(scale.at_or_throw(EScaleSteps.SuperTonic), "1A")), romanNumeral: "ii#dim7" },
    { ...get_chord("dim7", note_transpose(scale.at_or_throw(EScaleSteps.SubMediant), "1A")), romanNumeral: "vi#dim7" },
    { ...get_chord("dim", scale.at_or_throw(EScaleSteps.Mediant)), romanNumeral: "iiidim" },
    // add to test
  ]

  const additional = {
    "vii7": get_chord("m7", scale.at_or_throw(EScaleSteps.Leading)).symbol,
    "v7": get_chord("m7", scale.at_or_throw(EScaleSteps.Dominant)).symbol,
    "V7add6": get_chord("7add6", scale.at_or_throw(EScaleSteps.Dominant)).symbol,
    "V7b5": get_chord("7b5", scale.at_or_throw(EScaleSteps.Dominant)).symbol // not used yet
  } as const

  // adds the I7dom chord used with eg. blues progressions
  const substituteDominants = [get_chord("7", scale.at_or_throw(EScaleSteps.Tonic)).symbol, ...key.substituteDominants]
  
  return {
    ...primary_chords_and_inversions(["M", "m", "m", "M", "M", "m", "dim"], majorNumerals, key.scale),
    keyInfo: { ...key, scale: scale },
    type: key.type,
    tonic: key.tonic,
    suspended: suspended_primary_chords(["sus4", "sus4", "sus4", "sus4", "sus4", "sus4", "sus4"], majorSuspendedNumerals, key.scale),
    sevenths: seventh_chords_inversions(key.chords, majorSevenths),
    secondaryMajor: primary_chords_and_inversions(["M", "M", "M", "M", "M", "M", "M"], secondaryDominants, key.scale),
    secondaryDominants: seventh_chords_inversions(key.secondaryDominants.filter(c => c !== ""), secondaryDominantSevenths),
    substituteDominants : seventh_chords_inversions(substituteDominants.filter(c => c !== ""), substituteDominantSevenths),
    additional: seventh_chords_inversions(
      ObjectEntries(additional).values, ObjectEntries(additional).keys,
    ),
    other
  } as const;
}


