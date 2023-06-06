
import { Scale } from "@tonaljs/scale";
import { random_note_single_accidental, allScaleTypes, create_scale, scale_notes, octave } from "../utils";
import { Quiz } from "../quiz-types";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";


export const HearTetraChord: Quiz<string[]> = class extends ListeningQuizBase<string[]> {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote;
  randomScale;
  randomTetraChord;
  scaleTetraChords;
  octaveAudio = "4" as octave;
  audio; 

  private prepareAudio() : INotePlay[] {
   
    return this.randomTetraChord
    .toOctaveAscending(this.octaveAudio)
    .shuffleArray()
    .map(note => { return { noteNames: [note], duration: 1, channel : 1 } })
  }

  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.randomNote = random_note_single_accidental();

    const scales: Scale[] = scaleTypes.map(scaleType => 
      create_scale(this.randomNote, scaleType)
    );

    this.randomScale = scales.randomItem();
    this.randomTetraChord = scale_notes(this.randomScale).slice(0,4);
    this.scaleTetraChords = scales.map(scale => scale_notes(scale).slice(0,4)).shuffleArray();  

    this.audio = this.prepareAudio();
  }

  get quizHead() {
    return [];
  }

  get questionOptions() {
    return this.scaleTetraChords.map(st => st.commaSequence());
  }

  get question() {
    return "Which is the correct spelling?";
  }

  answer(): string {
    return this.randomTetraChord.commaSequence();
  }

  getAudio() {
    return [ { audio : [this.audio], keyboardKey : "space", onInit : true, message: "play tetrachord"} ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [
          "major",
          "aeolian",
          "phrygian",
          "lydian",
          "altered",
        ];
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord",
    };
  }
};
