import { random_note_single_accidental } from "../utils";
import { IQuizInstance, IQuiz } from "./quiztypes/quiz-types";
import {
  pitch_pattern_by_name,
  pattern_intervals,
  pitch_pattern_inversions,
  TPitchPatternName,
  pitchPatterns,
} from "../pitchPatterns";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";
import { ObjectEntries } from "../objectUtils";

const pitchPatternKeyNames = ObjectEntries(pitchPatterns).keys;

type TOptionsType = [{ name : string, options : readonly TPitchPatternName[]}]

export const HearTrichordPitchPatterns: IQuiz<TOptionsType> = class extends ListeningQuizBase<TOptionsType> {
  verify_options(options: TOptionsType): boolean {
    return options.first_and_only().options.every((pattern) => pitchPatternKeyNames.includes(pattern));
  }

  randomNote;
  randomPitchPattern;
  randomPatternName;
  audioChord;
  audioArpeggio;
  constructor(options: Readonly<TOptionsType>) {
    super(options);
    this.randomNote = random_note_single_accidental();
    this.randomPatternName = options.first().options.random_item();
    this.randomPitchPattern = pitch_pattern_by_name(this.randomPatternName);
    const [chord, arppeggio] = this.prepare_audio();
    this.audioChord = chord;
    this.audioArpeggio = arppeggio;
  }

  private prepare_audio() : INotePlay[][] {
    const pitchIntervals = pattern_intervals(this.randomPitchPattern);
    const patternInversions = pitch_pattern_inversions(this.randomNote, pitchIntervals);
    const patternInversAudio = patternInversions.random_item().to_octave_ascending("4")

    return [
      [{ noteNames: patternInversAudio, duration: 4 }],

      patternInversAudio.map((a) => {
        return { noteNames: [a], duration: 2 };
      }),
    ];
  }

  private get_pattern_description(p: TPitchPatternName) {
    return p + " - " + pitchPatterns[p].toString();
  }

  get quiz_head() {
    return [];
  }
  get question_options() {
    return pitchPatternKeyNames.map(this.get_pattern_description);
  }
  get question() {
    return "Which pitch pattern (or its inversion) do you hear?";
  }
  answer(): string {
    return this.get_pattern_description(this.randomPatternName)
  }

  audio() {
    return [
      { audio: [this.audioChord], keyboardKey: "space", onInit: true, channel: 1, message: "play trichord harmonically" },
      { audio: [this.audioArpeggio], keyboardKey: "s", channel: 1, message: "play trichord sequentially" },
    ];
  }

  protected override initTempo : number = 200;

  static meta() {
    return {
      get all_options() {
        return [{ name : "Pitch patterns", options : pitchPatternKeyNames }] as const;
      },
      name: "Hear trichord pitch patterns",
      description: "Identify the trichord pitch pattern that is being played",
      instructions : [
        "Try to sort the patterns ranging from consonant to dissonant.",
        "Then try to associate each with a musical phenomena similar to associating intervals with songs. eg 0-2-6 has a dominant seven sound",
        "Notice the pleasant sound of 0-1-5 even with the minor second"
      ]
    };
  }
};
