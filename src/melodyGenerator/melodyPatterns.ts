import { Interval, Note, Scale } from "@tonaljs/tonal";
import { EIntervalDistance, TNoteAllAccidentalOctave, get_interval_distance, get_interval_integer, note_transpose } from "../utils";
import { IMelodyGeneratorBase, MelodyGeneratorBase } from "./melodyGenerator";
import { INotePlay } from "../midiplay";

export const MelodySingulate: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "singular";
    static description = "1st (.)";
    public melody() {
        return [
            { note: [this.topNote], duration: 4 as const }
        ]
    }
}

export const MelodyPattern_001: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_001";
    static description = "1st-2nd (M3/m3), 1st (.)";
    public melody() {



        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.topNote], duration: 2 as const },
                { note: [this.secondNote], duration: 2 as const }
            ]
        } else {
            return [
                { note: [this.topNote], duration: 4 as const }
            ]
        }
    }
}

export const MelodyPattern_002: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_002";
    static description = "2nd-1st (M3/m3), 1st-(NT-below)-1st (.)";
    public melody() {

        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.keyInfo.harmonic.scale
        } else {
            scale = this.keyInfo.scale
        }

        const range = Scale.rangeOf(scale)(this.topNote,  note_transpose(this.topNote, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];

        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.secondNote], duration: 2 as const },
                { note: [this.topNote], duration: 2 as const },
            ]
        } else {
            return[
                { note: [this.topNote], duration: 1 as const },
                { note: [range.at(1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                // create instead a function that gets the closest note below the top note from all minor scales
                // this should handle modulating progressions also, like Autumn Leaves ending in minor 
                { note: [this.topNote], duration: 2 as const },
            ]
        }
    }
}

export const MelodyPattern_003: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_003";
    static description = "2nd-1st (M3/m3), 1st-(NT-above)-1st-(NT-below) (.)";
    public melody() {

        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.keyInfo.melodic.scale
            scale = !scale.contains(this.currentChord.map(n => Note.get(n).pc)) ? this.keyInfo.natural.scale : scale
        } else {
            scale = this.keyInfo.scale
        }

     

        let range = Scale.rangeOf(scale)(note_transpose(this.topNote, EIntervalDistance.OctaveUp),  note_transpose(this.topNote, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];
 
        if (!range.includes(this.topNote)) {
            range = range.map(n => Note.get(n).letter === Note.get(this.topNote).letter && Note.get(n).oct === Note.get(this.topNote).oct ?  this.topNote : n)
        }
        
        const indexTopNote = range.findIndex((n, index) => n === this.topNote)
        const indexSecondNote = range.findIndex((n, index) => n === this.secondNote)
        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)

      
        
            if (!this.nextChord) {
                if (previousTopNote === this.topNote ) {
                    return [
                        { note: [range.at(indexTopNote +1) as TNoteAllAccidentalOctave], duration: 2 as const },
                        { note: [this.topNote], duration: 2 as const }
                    ]
                }
                return [
                    { note: [this.topNote], duration: 4 as const }
                ]

            }

            if (intervalFromToptoSecond === 3) {
                if (get_interval_integer(
                    this.secondNote, 
                    previousTopNote as TNoteAllAccidentalOctave) > 3 
                    || previousTopNote === this.secondNote
                    || this.previousChord?.at(-2)?.note.at(-1) === this.topNote
                    ) {
                        return [
                            { note: [this.topNote], duration: 1 as const },
                            { note: [range.at(indexTopNote +1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                            { note: [this.secondNote], duration: 2 as const },
                        ]
                    }
                
                return [
                    { note: [this.secondNote], duration: 1 as const },
                    { note: [range.at(indexTopNote +1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                    { note: [this.topNote], duration: 2 as const },
                ]
            } 

            
            return[
                { note: [this.topNote], duration: 1 as const },
                { note: [range.at(indexTopNote -1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                // create instead a function that gets the closest note below the top note from all minor scales
                // this should handle modulating progressions also, like Autumn Leaves ending in minor 
                { note: [this.topNote], duration: 1 as const },
                { note: [range.at(indexTopNote +1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
            ]
        
    }
}

export const MelodyPattern_004: IMelodyGeneratorBase = class extends MelodyGeneratorBase {
    static id = "pattern_004";
    static description = "1st-2nd (M3/m3), 3rd-PT-2st (.)";
    public melody() {


        let scale;
        if (this.keyInfo.type === "minor") {
            scale = this.keyInfo.melodic.scale
            scale = !scale.contains(this.currentChord.map(n => Note.get(n).pc)) ? this.keyInfo.natural.scale : scale
        } else {
            scale = this.keyInfo.scale
        }

        let range = Scale.rangeOf(scale)(note_transpose(this.topNote, EIntervalDistance.OctaveUp),  note_transpose(this.topNote, EIntervalDistance.OctaveDown)) as TNoteAllAccidentalOctave[];
 
        if (!range.includes(this.topNote)) {
            range = range.map(n => Note.get(n).letter === Note.get(this.topNote).letter && Note.get(n).oct === Note.get(this.topNote).oct ?  this.topNote : n)
        }

        if (!range.includes(this.secondNote)) {
            range = range.map(n => Note.get(n).letter === Note.get(this.secondNote).letter && Note.get(n).oct === Note.get(this.secondNote).oct ?  this.secondNote : n)
        }
       
        
        const indexTopNote = range.findIndex((n, index) => n === this.topNote)
        const indexSecondNote = range.findIndex((n, index) => n === this.secondNote)
        const previousTopNote = this.previousChord?.at(-1)?.note.at(-1)


        const intervalFromToptoSecond = Math.abs(get_interval_integer(this.topNote, this.secondNote));

        if (!this.nextChord) {
                return [
                    { note: [this.topNote], duration: 4 as const }
                ]
        }


        if (intervalFromToptoSecond === 3) {
            return [
                { note: [this.topNote], duration: 2 as const },
                { note: [this.secondNote], duration: 2 as const },
            ]
        } else {
            
                return[
                    { note: [this.thirdNote], duration: 1 as const },
                    { note: [range.at(indexSecondNote +1) as TNoteAllAccidentalOctave], duration: 1 as const }, 
                    { note: [this.secondNote], duration: 2 as const },
                ]
 
        }
        
    }
}