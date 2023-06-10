import {  INotePlay, play_midi } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";

interface IAudioPlayBase {
  keyboardKey: string;
  message: string;
  onInit?: boolean;
  backgroundChannel?: boolean;
}

interface IAudioPlayMix extends IAudioPlayBase {
  audio: INotePlay[][];
  display?: false
}

interface IAudioPlaySolo extends IAudioPlayBase {
  audio: INotePlay[]
  display: true;
}

type IAudioPlay = IAudioPlaySolo | IAudioPlayMix;

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
          if (audioPart.display) {
            play_midi(audioPart.audio, acObj.ac, audioPart.backgroundChannel ? 10 : 1, timerObj, this.tempo);
          } else {
            for (let index = 0; index < audioPart.audio.length; index++) {
              play_midi(audioPart.audio[index], acObj.ac, audioPart.backgroundChannel ? 10 : index, timerObj, this.tempo);
            }
          }

        }
      };
      return {
        listener: listener,
        acObj: acObj,
        isBackgroundChannel: audioPart.backgroundChannel
      };
    });
  }

  abstract audio(): IAudioPlay[];

  abstract call_quiz(): Promise<string | never>;

  async execute(): Promise<string | never> {
    this.listenersArray.push(...this.createListeners(this.audio()));
    this.attachListeners(this.listenersArray);
    this.audio().forEach((audioPart) => {
      if (audioPart.onInit) {
        process.stdin.emit("keypress", null, { name: audioPart.keyboardKey });
      }
    });
    return await this.call_quiz();
  }
}
