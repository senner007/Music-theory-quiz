import { playMidi, INotePlay } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";

interface IAudioPlay {
  audio: INotePlay[];
  keyboardKey: string;
  onInit: boolean;
  channel: number;
  message: string;
  display?: boolean;
}

export abstract class AudioQuizBase<T> extends QuizBase<T> {
  protected tempo: number = 500;

  private createListeners(audioParts: IAudioPlay[]): IListener[] {
    return audioParts.map((audioPart) => {
      let acObj = { ac: new AbortController() };
      let timerObj: any;

      const listener = (_: any, key: any) => {
        if (key.name === audioPart.keyboardKey) {
          this.listenersArray
            .filter(l => l.channel === audioPart.channel)
            .forEach(l => l.acObj?.ac.abort())
            acObj.ac = new AbortController();
          playMidi(audioPart.audio, acObj.ac, audioPart.channel, timerObj, this.tempo);
        }
      };
      return {
        listener: listener,
        acObj: acObj,
        channel : audioPart.channel
      };
    });
  }

  abstract getAudio(): IAudioPlay[];

  abstract callQuiz(): Promise<string | never>;

  async execute(): Promise<string | never> {
    this.listenersArray.push(...this.createListeners(this.getAudio()));
    this.attachListeners(this.listenersArray);
    this.getAudio().forEach((audioPart) => {
      if (audioPart.onInit) {
        process.stdin.emit("keypress", null, { name: audioPart.keyboardKey });
      }
    });
    return await this.callQuiz();
  }
}
