import { remove_octave } from "../solfege";
import { interval_direction, interval_distance, note_transpose } from "../tonal-interface";
import { TNoteAllAccidental, TNoteAllAccidentalOctave, interval_simplify } from "../utils";
import { TKeyInfo } from "../keyinfo/keyInfo";
import { ChordFunction, IMelodyFragment } from "./melodyGeneratorBase";


class ConditionHelpers {
    protected notes_contain(pattern: TNoteAllAccidentalOctave[] | undefined, note: TNoteAllAccidental | undefined): boolean {
        if (!pattern) return false;
        if (!note) return false;

        return (pattern.map(n => remove_octave(n)) as TNoteAllAccidental[]).includes(note)
    }
}

export class Conditions extends ConditionHelpers {

    previousNotes: TNoteAllAccidentalOctave[] | undefined
    previousLastNote : TNoteAllAccidentalOctave | undefined
    constructor(
        protected currentFunction: ChordFunction,
        protected previousFunction: ChordFunction | undefined,
        protected previousMelody: readonly IMelodyFragment[] | undefined,
        private keyInfo: TKeyInfo,
        protected nextChordFunction: ChordFunction | undefined,
        protected previousBassNote : TNoteAllAccidentalOctave | undefined,
        protected bassNote : TNoteAllAccidentalOctave,
    ) {
        super();
        this.previousNotes = this.previousMelody?.map(n => n.note).flat();
        this.previousLastNote = this.previousNotes?.last()
    }

    protected get is_deceptive_to_previous_dominant(): boolean {
        if (!this.previousFunction) return false;
        if (!this.previousFunction.isDominant) return false;

        if (this.keyInfo.type === "major") {

            const isSecondAboveDominant = this.currentFunction.tonic === note_transpose(this.previousFunction.tonic, "2M");
            const isMinor = !this.currentFunction.isMajor

            if (isSecondAboveDominant && isMinor) {
                return true;
            }
            return false;
        }

        if (this.keyInfo.type === "minor") {

            // TODO : test me!

            const isSecondAboveDominant = this.previousFunction.tonic === note_transpose(this.currentFunction.tonic, "2m");
            const isMajor = this.currentFunction.isMajor
            if (isSecondAboveDominant && isMajor) {
                return true;
            }
            return false;

        }
        return false;

    }


    protected get previous_notes_contains_leading_note(): boolean {
        if (!this.previousFunction) return false;
        if (!this.previousNotes) return false;
        if (!this.previousFunction.leadingNote) return false;

        return this.notes_contain(this.previousNotes, this.previousFunction.leadingNote)
    }

    protected get previous_notes_contains_seventh(): boolean {
        if (!this.previousFunction) return false;
        if (!this.previousNotes) return false;

        const majorSeventh = note_transpose(this.previousFunction.tonic, "7M")
        const previousNotesNoOctaves = this.previousNotes.map(n => remove_octave(n));

        return this.previous_notes_contains_minor_seventh || previousNotesNoOctaves.includes(majorSeventh)
    }

    private get previous_notes_contains_minor_seventh(): boolean {
        if (!this.previousNotes) return false;
        if (!this.previousFunction) return false;

        const minorSeventh = note_transpose(this.previousFunction.tonic, "7m")
        const previousNotesNoOctaves = this.previousNotes.map(n => remove_octave(n));
        return previousNotesNoOctaves.includes(minorSeventh)
    }

    public note_same_as_previous(pattern: TNoteAllAccidentalOctave[] | undefined): boolean {
        if (!this.previousMelody) return false;
        if (!pattern) return false;

        return pattern.first() === this.previousLastNote
    }


    protected pattern_includes_tonic(pattern: TNoteAllAccidentalOctave[] | undefined): boolean  {
        return this.notes_contain(pattern, this.currentFunction.tonic)
    }

    public pattern_includes_third(pattern: TNoteAllAccidentalOctave[] | undefined): boolean  {
        return this.notes_contain(pattern, this.currentFunction.third)
    }

    protected pattern_includes_seventh(pattern: TNoteAllAccidentalOctave[] | undefined): boolean  {
        return this.notes_contain(pattern, this.currentFunction.seventh)
    }

    protected get is_tonic_to_previous_dominant(): boolean {
        if (!this.previousFunction) return false;

        const IntervalFifth = "5P";
        return this.previousFunction.isDominant
            && ((this.previousFunction.tonic === note_transpose(this.currentFunction.tonic, IntervalFifth)) || this.is_deceptive_to_previous_dominant)
            && (this.previous_notes_contains_minor_seventh || this.previous_notes_contains_leading_note)
    }

    protected pattern_includes_dominant_resolution(pattern: TNoteAllAccidentalOctave[] | undefined): boolean  {

        if (!pattern) return false;
        if (!this.previousFunction) return false;
        if (!this.is_tonic_to_previous_dominant) return false;

        const includesLeadingResolutionTonic = this.notes_contain(pattern, note_transpose(this.previousFunction.leadingNote!, "2m"));
        const includesLeadingResolutionSeventh = this.notes_contain(pattern, this.previousFunction.leadingNote!);
        const includesSeventhResolutionMajor = this.notes_contain(pattern, note_transpose(this.previousFunction.tonic!, "-3m"))
        const includesSeventhResolutionMinor = this.notes_contain(pattern, note_transpose(this.previousFunction.tonic!, "-3M"))
        if (this.previous_notes_contains_leading_note && this.previous_notes_contains_minor_seventh) {
            return includesLeadingResolutionTonic
                && (includesSeventhResolutionMajor || includesSeventhResolutionMinor)
        }

        if (this.previous_notes_contains_leading_note) {

            return includesLeadingResolutionTonic || includesLeadingResolutionSeventh
        }

        if (this.previous_notes_contains_minor_seventh) {
            return (includesSeventhResolutionMajor || includesSeventhResolutionMinor)
        }

        return false;
    }

    public get isCadence(): boolean {
        return this.nextChordFunction === undefined
    }

}


