import { playMidi, INotePlay } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";

interface IAudioPlay {
  audio: INotePlay[][];
  keyboardKey: string;
  message: string;
  onInit?: boolean;
  backgroundChannel?: boolean;
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
            .filter(l => !audioPart.backgroundChannel)
            .forEach(l => l.acObj?.ac.abort())
            acObj.ac = new AbortController();
           for (let index = 0; index < audioPart.audio.length; index++) {
            playMidi(audioPart.audio[index], acObj.ac, audioPart.backgroundChannel ? 10 : index, timerObj, this.tempo);
           }  
        }
      };
      return {
        listener: listener,
        acObj: acObj,
        isBackgroundChannel : audioPart.backgroundChannel
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
