
import { random_note_single_accidental, allScaleTypes, create_scale, scale_notes, TOctave } from "../utils";
import { IQuiz } from "../quiz-types";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

type optionType = [{ name : string, options : readonly string[] }]

export const HearTetraChord: IQuiz<optionType> = class extends ListeningQuizBase<optionType> {
  verifyOptions(options: optionType): boolean {
    return options.firstAndOnly().options.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote;
  randomScale;
  randomTetraChord;
  scaleTetraChords;
  octaveAudio = "4" as TOctave;
  audio; 

  private prepareAudio() : INotePlay[] {
   
    return this.randomTetraChord
    .toOctaveAscending(this.octaveAudio)
    .shuffleArray()
    .map(note => { return { noteNames: [note], duration: 1, channel : 1 } })
  }

  constructor(options: Readonly<optionType>) {
    super(options);
    this.randomNote = random_note_single_accidental();

    const scales = options.firstAndOnly().options.map(scaleType => 
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

  answer() {
    return this.randomTetraChord.commaSequence();
  }

  getAudio() {
    return [ { audio : [this.audio], keyboardKey : "space", onInit : true, message: "play tetrachord"} ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [{ name : "Scale types", options : [
          "major",
          "aeolian",
          "phrygian",
          "lydian",
          "altered",
      ]}] as const
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord",
    };
  }
};
