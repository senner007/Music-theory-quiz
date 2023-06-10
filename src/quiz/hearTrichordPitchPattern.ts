import { ObjectKeys, random_note_single_accidental } from "../utils";
import { IQuizInstance, IQuiz } from "../quiz-types";
import {
  get_pattern,
  pattern_intervals,
  pitch_pattern_inversions,
  TPitchPatternName,
  pitchPatterns,
} from "../pitchPatterns";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

const pitchPatternKeyNames = ObjectKeys(pitchPatterns);

type optionsType = [{ name : string, options : readonly TPitchPatternName[]}]

export const HearTrichordPitchPatterns: IQuiz<optionsType> = class extends ListeningQuizBase<optionsType> {
  verifyOptions(options: optionsType): boolean {
    return options.first_and_only().options.every((pattern) => pitchPatternKeyNames.includes(pattern));
  }

  randomNote;
  randomPitchPattern;
  randomPatternName;
  audioChord;
  audioArpeggio;
  constructor(options: Readonly<optionsType>) {
    super(options);
    this.randomNote = random_note_single_accidental();
    this.randomPatternName = options[0].options.random_item();
    this.randomPitchPattern = get_pattern(this.randomPatternName);
    const [chord, arppeggio] = this.prepareAudio();
    this.audioChord = chord;
    this.audioArpeggio = arppeggio;
  }

  private prepareAudio() : INotePlay[][] {
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

  private getPatternDescription(p: TPitchPatternName) {
    return p + " - " + pitchPatterns[p].toString();
  }

  get quizHead() {
    return [];
  }
  get questionOptions() {
    return pitchPatternKeyNames.map(this.getPatternDescription);
  }
  get question() {
    return "Which pitch pattern do you hear?";
  }
  answer(): string {
    return this.getPatternDescription(this.randomPatternName)
  }

  audio() {
    return [
      { audio: [this.audioChord], keyboardKey: "space", onInit: true, channel: 1, message: "play trichord harmonically" },
      { audio: [this.audioArpeggio], keyboardKey: "l", channel: 1, message: "play trichord sequentially" },
    ];
  }

  static meta() {
    return {
      get getAllOptions() {
        return [{ name : "Pitch patterns", options : pitchPatternKeyNames }] as const;
      },
      name: "Hear trichord pitch patterns",
      description: "Identify the trichord pitch pattern that is being played",
    };
  }
};
