import { remove_octave } from "../solfege";
import { interval_distance, note_transpose } from "../tonal-interface";
import { TNoteAllAccidentalOctave, interval_simplify } from "../utils";
import { ChordFunction, IMelodyFragment } from "./melodyGenerator";
import { TKeyInfo } from "../keyinfo/keyInfo";


export class Conditions {

    constructor(
        protected currentFunction: ChordFunction,
        protected previousFunction: ChordFunction | undefined,
        protected previousNotes: readonly IMelodyFragment[] | undefined,
        private keyInfo: TKeyInfo,
        protected nextChordFunction : ChordFunction | undefined
    ) {

    }

    protected get is_deceptive_to_previous_dominant(): boolean {
        if (!this.previousFunction) return false;
        if (!this.previousFunction.isDominant) return false;

        if (this.keyInfo.type === "major") {

            const isSecondAboveDominant = this.currentFunction.tonic === note_transpose(this.previousFunction.tonic, "2M");
            const isMinor = this.currentFunction.isMajor

            if (isSecondAboveDominant && isMinor) {
                return true;
            }
            return false;
        }

        if (this.keyInfo.type === "minor") {

            const isSecondAboveDominant = this.previousFunction.tonic === note_transpose(this.currentFunction.tonic, "2m");
            const isMajor = this.currentFunction.isMajor
            if (isSecondAboveDominant && isMajor) {
                return true;
            }
            return false;

        }
        return false;

    }


    protected get previous_notes_contains_leading_note() {
        if (!this.previousFunction) return false;
        if (!this.previousNotes) return false;
        if (!this.previousFunction.leadingNote) return false;

        return this.previousNotes.map(n => n.note).flat().map(n => remove_octave(n)).includes(this.previousFunction.leadingNote) === true
    }

    protected get previous_notes_contains_seventh() {
        if (!this.previousFunction) return false;
        if (!this.previousNotes) return false;

        const minorSeventh = note_transpose(this.previousFunction.tonic, "7m")
        const majorSeventh = note_transpose(this.previousFunction.tonic, "7M")
        const previousNotesNoOctaves = this.previousNotes.map(n => n.note).flat().map(n => remove_octave(n));

        return previousNotesNoOctaves.includes(minorSeventh) === true || previousNotesNoOctaves.includes(majorSeventh) === true
    }

    private get previous_notes_contains_minor_seventh(): boolean {
        if (!this.previousNotes) return false;
        if (!this.previousFunction) return false;

        const minorSeventh = note_transpose(this.previousFunction.tonic, "7m")
        const previousNotesNoOctaves = this.previousNotes.map(n => n.note).flat().map(n => remove_octave(n));
        return previousNotesNoOctaves.includes(minorSeventh) === true
    }

    public note_same_as_previous(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!this.previousNotes) return false;
        if (!pattern) return false;

        return pattern.first() === this.previousNotes.at_or_throw(-1).note.first();
    }

    protected pattern_includes_tonic(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!pattern) return false;
        if (!this.currentFunction.tonic) return false;

        return pattern.map(n => remove_octave(n)).includes(this.currentFunction.tonic) == true
    }

    public pattern_includes_third(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!pattern) return false;
        if (!this.currentFunction.third) return false;

        return pattern.map(n => remove_octave(n)).includes(this.currentFunction.third) == true
    }

    protected pattern_includes_seventh(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!pattern) return false;
        if (!this.currentFunction.seventh) return false;

        return pattern.map(n => remove_octave(n)).includes(this.currentFunction.seventh) == true
    }

    protected get is_tonic_to_previous_dominant(): boolean {
        if (!this.previousFunction) return false;
        
        const IntervalFifth = "5P";
        return this.previousFunction.isDominant
            && ((this.previousFunction.tonic === note_transpose(this.currentFunction.tonic, IntervalFifth)) || this.is_deceptive_to_previous_dominant)
            && (this.previous_notes_contains_seventh || this.previous_notes_contains_leading_note)
    }

    protected pattern_includes_dominant_resolution(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!pattern) return false;
        if (!this.previousFunction) return false;
        if (!this.is_tonic_to_previous_dominant) return false;

        const includesLeadingResolutionTonic = pattern.map(n => remove_octave(n)).includes(note_transpose(this.previousFunction.leadingNote!, "2m"));
        const includesLeadingResolutionSeventh = pattern.map(n => remove_octave(n)).includes(this.previousFunction.leadingNote!);
        const includesSeventhResolutionMajor = pattern.map(n => remove_octave(n)).includes(note_transpose(this.previousFunction.minorSeventh!, "-2m"))
        const includesSeventhResolutionMinor = pattern.map(n => remove_octave(n)).includes(note_transpose(this.previousFunction.minorSeventh!, "-2M"))

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

export class GlobalConditions extends Conditions {
    constructor(
        currentFunction: ChordFunction,
        previousFunction: ChordFunction | undefined,
        previousNotes: readonly IMelodyFragment[] | undefined,
        keyInfo: TKeyInfo,
        nextChordFunction: ChordFunction | undefined,
        private previousBass: TNoteAllAccidentalOctave | undefined,
        private bass : TNoteAllAccidentalOctave
    ) {
        super(currentFunction, previousFunction, previousNotes, keyInfo, nextChordFunction)
    }

    public globalConditionsCheck(pattern: TNoteAllAccidentalOctave[] | undefined) {
        return this.hasNoParallelOctavesOrFifths(pattern) && this.resolvesDominant(pattern)
    }

    private resolvesDominant(pattern: TNoteAllAccidentalOctave[] | undefined) {
     
        if (this.is_tonic_to_previous_dominant) {
            return this.pattern_includes_dominant_resolution(pattern)
        };
        return true;
    }

    private hasNoParallelOctavesOrFifths(pattern: TNoteAllAccidentalOctave[] | undefined) {
        if (!pattern) return true;
        if (!this.previousNotes) return true;

        const previousNote = this.previousNotes.at_or_throw(-1).note.first();
        const distancePrevious = interval_simplify(interval_distance(this.previousBass!, previousNote))
        const distanceCurrent = interval_simplify(interval_distance(this.bass, pattern.first()))


        if ((distancePrevious === "1P" || distancePrevious === "5P" || distancePrevious === "8P") && distancePrevious === distanceCurrent) {
            return false;
        }

        // hidden parallels
        if ((distancePrevious === "1P" && distanceCurrent === "8P") || (distancePrevious === "8P" && distanceCurrent === "1P")) {
            return false;
        }

        return true;
    }
  
}
