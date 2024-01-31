
import { random_note_single_accidental, TOctave } from "../utils";
import { IQuiz, IQuizOptions, TOptionsReturnType } from "./quiztypes/quiz-types";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";
import { allScaleNamesSorted, create_scale, scale_notes } from "../tonal-interface";

const options = [{ name : "Scale types", cliShort : "s", options :  () => [
  "major",
  "minor",
  "phrygian",
  "lydian",
  "altered",
]}] as const

type TOptionsType = typeof options;

export const HearTetraChord: IQuiz<TOptionsType> = class extends ListeningQuizBase<TOptionsReturnType<TOptionsType>> {

  verify_options(options: TOptionsReturnType<TOptionsType>): boolean {
    return options.first_and_only().options.every((scaleType) => allScaleNamesSorted.includes(scaleType));
  }

  randomNote;
  randomScale;
  randomTetraChord;
  scaleTetraChords;
  octaveAudio = "4" as TOctave;
  initAudio; 

  private prepareAudio() : INotePlay[] {
   
    return this.randomTetraChord
    .to_octave_ascending(this.octaveAudio)
    .shuffle_array()
    .map(note => { return { noteNames: [note], duration: 1, channel : 1 } })
  }

  constructor(options: Readonly<TOptionsReturnType<TOptionsType>>) {
    super(options);
    const [scaleOptions] = options;

    this.randomNote = random_note_single_accidental();

    const scales = scaleOptions.options.map(scaleType => 
      create_scale(this.randomNote, scaleType)
    );

    this.randomScale = scales.random_item();
    this.randomTetraChord = scale_notes(this.randomScale).slice(0,4);
    this.scaleTetraChords = scales.map(scale => scale_notes(scale).slice(0,4)).shuffle_array();  

    this.initAudio = this.prepareAudio();
  }

  get quiz_head() {
    return [];
  }

  get question_options() {
    return this.scaleTetraChords.map(st => st.comma_sequence());
  }

  get question() {
    return "Which is the correct spelling?";
  }

  answer() {
    return this.randomTetraChord.comma_sequence();
  }

  audio() {
    return [ { audio : this.initAudio, keyboardKey : "space", onInit : true, message: "play tetrachord", solo : true} ] as const
  }

  protected override initTempo : number = 200;

  static meta() {
    return {
      get all_options() {
        return options
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord",
    };
  }
};
