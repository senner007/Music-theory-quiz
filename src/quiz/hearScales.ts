import { random_note_single_accidental, allScaleTypes, create_scale, scale_notes, event_by_probability, add_octave_note, octave } from "../utils";
import { Quiz } from "../quiz-types";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

export const HearScales: Quiz<string[]> = class extends ListeningQuizBase<string[]> {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote;
  scalePick;
  similarScales;
  audio;
  octave: octave = "4";
  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    const nChoices = 7; // should be option parameter
    this.randomNote = random_note_single_accidental();
    const allScales = scaleTypes.shuffleArray().map(scaleName => {
      const scale = create_scale(this.randomNote, scaleName);
      return { scale: scale, description: scale.type + " - " + scale.intervals };
    });

    const randomScale = allScales.randomItem();

    this.similarScales = allScales
      .filter(s => s.scale.notes.length === randomScale.scale.notes.length)
      .slice(0, nChoices);

    this.scalePick = this.similarScales.randomItem();
    this.audio = this.prepareAudio();

  }

  private prepareAudio (): INotePlay[] {
    const scaleNotes = scale_notes(this.scalePick.scale).toOctaveAscending(this.octave);
      const scaleNotesWithOctave = add_octave_note(scaleNotes);
      const scaleNotesAudio = scaleNotesWithOctave
        .map(note => { return { noteNames: [note], duration: 1 } as INotePlay })
      
      if (event_by_probability(50)) {
        scaleNotesAudio.reverse();
      }

      return scaleNotesAudio;
      
  }

  get quizHead() {
    return [];
  }
  get questionOptions() {
    return this.similarScales.map(
      scales => scales.description
    );
  }
  get question() {
    return "Which scale do you hear?";
  }
  answer(): string {
    return this.scalePick.description;
  }

  getAudio() {
    return [ 
      { audio : this.audio, keyboardKey : "space", onInit : true, channel : 1, message : "play scale"}
    ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [
            "aeolian",
            "altered",
            "augmented",
            "augmented heptatonic",
            "balinese",
            "bebop",
            "bebop locrian",
            "bebop major",
            "bebop minor",
            "chromatic",
            "composite blues",
            "diminished",
            "dorian",
            "dorian #4",
            "dorian b2",
            "double harmonic lydian",
            "double harmonic major",
            "egyptian",
            "enigmatic",
            "flamenco",
            "flat six pentatonic",
            "flat three pentatonic",
            "half-whole diminished",
            "harmonic major",
            "harmonic minor",
            "hirajoshi",
            "hungarian major",
            "hungarian minor",
            "ichikosucho",
            "in-sen",
            "ionian pentatonic",
            "iwato",
            "kafi raga",
            "kumoijoshi",
            "leading whole tone",
            "locrian",
            "locrian #2",
            "locrian 6",
            "locrian major",
            "locrian pentatonic",
            "lydian",
            "lydian #5P pentatonic",
            "lydian #9",
            "lydian augmented",
            "lydian diminished",
            "lydian dominant",
            "lydian dominant pentatonic",
            "lydian minor",
            "lydian pentatonic",
            "major",
            "major augmented",
            "major blues",
            "major pentatonic",
            "malkos raga",
            "melodic minor",
            "messiaen's mode #3",
            "messiaen's mode #4",
            "messiaen's mode #5",
            "messiaen's mode #6",
            "messiaen's mode #7",
            "minor #7M pentatonic",
            "minor bebop",
            "minor blues",
            "minor hexatonic",
            "minor pentatonic",
            "minor six diminished",
            "minor six pentatonic",
            "mixolydian",
            "mixolydian b6",
            "mixolydian pentatonic",
            "mystery #1",
            "neopolitan major",
            "neopolitan major pentatonic",
            "oriental",
            "pelog",
            "persian",
            "phrygian",
            "phrygian dominant",
            "piongio",
            "prometheus",
            "prometheus neopolitan",
            "purvi raga",
            "ritusen",
            "scriabin",
            "six tone symmetric",
            "spanish heptatonic",
            "super locrian pentatonic",
            "todi raga",
            "ultralocrian",
            "vietnamese 1",
            "whole tone",
            "whole tone pentatonic",
        ];
      },
      name: "Hear scales",
      description: "Identify the name of the scale that is being played",
    };
  }
};
