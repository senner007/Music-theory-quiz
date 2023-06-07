import { ObjectKeys, random_note_single_accidental } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import {
  getPattern,
  getPatternIntervals,
  getPitchPatternInversions,
  pitchPatternName,
  pitchPatterns,
} from "../pitchPatterns";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";
import { INotePlay } from "../midiplay";

const pitchPatternKeyNames = ObjectKeys(pitchPatterns);

type optionsType = [{ name : string, options : readonly pitchPatternName[]}]

export const HearTrichordPitchPatterns: Quiz<optionsType> = class extends ListeningQuizBase<optionsType> {
  verifyOptions(options: optionsType): boolean {
    return options[0].options.every((pattern) => pitchPatternKeyNames.includes(pattern));
  }

  randomNote;
  randomPitchPattern;
  randomPatternName;
  audioChord;
  audioArpeggio;
  constructor(options: Readonly<optionsType>) {
    super(options);
    this.randomNote = random_note_single_accidental();
    this.randomPatternName = options[0].options.randomItem();
    this.randomPitchPattern = getPattern(this.randomPatternName);
    const [chord, arppeggio] = this.prepareAudio();
    this.audioChord = chord;
    this.audioArpeggio = arppeggio;
  }

  private prepareAudio() : INotePlay[][] {
    const pitchIntervals = getPatternIntervals(this.randomPitchPattern);
    const patternInversions = getPitchPatternInversions(this.randomNote, pitchIntervals);
    const patternInversAudio = patternInversions.randomItem().toOctaveAscending("4")

    return [
      [{ noteNames: patternInversAudio, duration: 4 }],

      patternInversAudio.map((a) => {
        return { noteNames: [a], duration: 2 };
      }),
    ];
  }

  private getPatternDescription(p: pitchPatternName) {
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

  getAudio() {
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
