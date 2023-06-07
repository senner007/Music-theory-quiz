import { Chord, Key } from "@tonaljs/tonal";
import chalk from "chalk";
import { romanNumeralChord, progressions, Progression } from "../harmonicProgressions";
import { keyInfo, getNumeralBySymbol } from "../keyInfo";
import { INotePlay } from "../midiplay";
import { Quiz } from "../quiz-types";
import { ITableHeader } from "../solfege";
import { transposeProgression } from "../transposition";
import { noteSingleAccidental, toOctave, note_transpose, random_note_single_accidental } from "../utils";
import { SingingQuizBase } from "./quizBase/singingQuizBase";
import { melodyGenerator, melodyPattern, melodySingulate } from "../melodyGenerator";

export const SingHarmony: Quiz<Progression["description"][]> = class extends SingingQuizBase<Progression["description"][]> {
  verifyOptions(_: Progression["description"][]): boolean {
    return true;
  }

  randomNote: noteSingleAccidental;
  override tempo = 200;
  chords;
  randomProgressionInKey;
  melody;
  progressionTags;
  progressionDescription;
  progressionIsDiatonic;
  progressionIsMajor;
  keyInfo;
  constructor(progressionDescriptions: Readonly<Progression["description"][]>) {
    super(progressionDescriptions);
    this.randomNote = random_note_single_accidental();
    const selectProgressions = progressions.filter(p => progressionDescriptions.some(description => description === p.description));
    const randomProgression = selectProgressions.map(p => p.progressions).flat().randomItem();
    this.progressionTags = randomProgression.tags;
    this.progressionDescription = randomProgression.description;
    this.progressionIsDiatonic = randomProgression.isDiatonic;
    this.progressionIsMajor = randomProgression.isMajor;
    this.keyInfo = keyInfo(this.progressionIsMajor ? Key.majorKey(this.randomNote) : Key.minorKey(this.randomNote));
    const randomProgressionInC = {
      chords: randomProgression.chords.map((c) => romanNumeralChord(c)),
      bass: randomProgression.bass,
    };

    this.randomProgressionInKey = transposeProgression(randomProgressionInC, this.randomNote);

    this.chords = this.randomProgressionInKey.chords.map((n, index: number) => {
      return getNumeralBySymbol(this.keyInfo, [this.randomProgressionInKey.bass[index], ...n])
    });

    this.melody = melodyGenerator(this.randomProgressionInKey, melodySingulate);

  }

  get quizHead() {
    const description = this.progressionDescription
      ? `Description: ${chalk.underline(this.progressionDescription)}`
      : "";

    const chords = `${this.chords.join(", ")}`;
    const identifiers = this.progressionTags ? `Identifiers: ${chalk.underline(this.progressionTags.join(", "))}` : "";
    return [
      `${description} ${identifiers}`,
      `${
        this.progressionIsDiatonic ? chalk.underline("Diatonic") : chalk.underline("Non-diationic")
      } progression in key of ${chalk.underline(
        this.randomNote + " " + (this.progressionIsMajor ? "Major" : "Minor")
      )}`,
      chords,
    ];
  }

  get question() {
    return "";
  }

  getAudio() {
    const audio = this.melody.melodyNotes.map((n): INotePlay => {
      return { noteNames: n.note, duration: n.duration };
    });

    const audioBass = this.melody.bass.map((n, index): INotePlay => {
      return { noteNames: [n], duration: this.melody.timeSignature };
    });

    const keyAudio = [
      {
        noteNames: [
          // abstract me out! // major or minor version
          toOctave(this.randomNote, "2"),
          toOctave(this.randomNote, "3"),
          toOctave(note_transpose(this.randomNote, this.progressionIsMajor ? "3M" : "3m"), "3"),
          toOctave(note_transpose(this.randomNote, "P5"), "3"),
        ],
        duration: 2,
      } as INotePlay,
    ];

    return [
      { audio: audio, keyboardKey: "space", message: "play progression", display: true } as const,
      { audio: [audioBass], keyboardKey: "b", message: "play bass line" },
      { audio: [audio, audioBass], keyboardKey: "m", message: "play progression with bass line" },
      { audio: [keyAudio], keyboardKey: "l", onInit: true, backgroundChannel: true, message: "establish key" },
    ]
  }

  get tableHeader() {
    return this.chords.map((c): ITableHeader => {
      return { name: c, duration: this.melody.timeSignature };
    });
  }

  static meta() {
    return {
      get getAllOptions() {
        return progressions.map(p => p.description)
      },
      name: "Sing harmonic progressions",
      description: "Sing the harmonic progression as solfege degrees",
      instructions: [
        "Sing various lines using the notes that make the harmony.", 
        "Sing with or without accompaniment.",
        "Slso try to include non chord tones, passing tones, suspensions, escape tones, neighbouring tones, appogiatura and anticipation"
      ]
    };
  }
};
