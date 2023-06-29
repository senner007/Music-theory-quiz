
import inquirer from "inquirer";
import {  INotePlay, play_midi } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";
import { bottomBar } from "../../logger/logAsync";

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

  protected oppositeSizeInRange(
      number: number, 
      minInput: number = this.TEMPO_MIN, 
      maxInput: number = this.TEMPO_MAX, 
      minOutput: number = this.TEMPO_DISPLAY_MIN, 
      maxOutput: number = this.TEMPO_DISPLAY_MAX
    ) {
    // Scale the input number to a value between 0 and 1
    const scaledInput = (number - minInput) / (maxInput - minInput);
  
    // Scale the output range based on the desired minOutput and maxOutput
    const scaledOutput = (maxOutput - minOutput) * (1 - scaledInput) + minOutput;
  
    // Round the scaled output to the nearest whole number
    const roundedOutput = Math.round(scaledOutput);
  
    return roundedOutput;
  }
  
  protected abstract tempo(): number
  private TEMPO_MAX = 1000;
  private TEMPO_MIN = 100;
  private TEMPO_DISPLAY_MAX = 10;
  private TEMPO_DISPLAY_MIN = 1;
  private TEMPO_STEP = 100;

  protected tempoText = `Tempo : ${this.oppositeSizeInRange(this.tempo())} - Change with key command: Ctrl-(left/right)`;

  private create_listeners(audioParts: IAudioPlay[]): IListener[] {
    return audioParts.map((audioPart) => {
      let acObj = { ac: new AbortController() };

      const listener = (_: any, key: any) => {
        if (key.name === audioPart.keyboardKey) {
          this.listenersArray
            .filter(l => !audioPart.backgroundChannel)
            .forEach(l => l.acObj?.ac.abort())
          acObj.ac = new AbortController();
          if (audioPart.display) {
            play_midi(audioPart.audio, acObj.ac, audioPart.backgroundChannel ? 10 : 1, this.tempo());
          } else {
            for (let index = 0; index < audioPart.audio.length; index++) {
              play_midi(audioPart.audio[index], acObj.ac, audioPart.backgroundChannel ? 10 : index, this.tempo());
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

  private tempo_listener(): IListener {
    const listener = (_: any, key: any) => {
      const tempo = (tempo: number) => {
        this.change_tempo(this.tempo() + tempo)
        bottomBar.updateBottomBar("Tempo: " + (this.oppositeSizeInRange(this.tempo())).toString());
      }

      if (key.ctrl && key.name === "left") {
        tempo(this.tempo() >= this.TEMPO_MAX ? 0 : this.TEMPO_STEP); // here the max tempo should be derived from each sub class
      }
      if (key.ctrl && key.name === "right") {
        tempo(this.tempo() <= this.TEMPO_MIN ? 0 : -this.TEMPO_STEP);
      }
     
    };
    return {
      listener
    };
  }

  abstract audio(): IAudioPlay[];
  abstract change_tempo(tempo : number): void

  abstract call_quiz(): Promise<string | never>;

  async execute(): Promise<string | never> {
    this.listenersArray.push(...this.create_listeners(this.audio()));
    this.listenersArray.push(this.tempo_listener());
    this.attach_listeners(this.listenersArray);
    this.audio().forEach((audioPart) => {
      if (audioPart.onInit) {
        process.stdin.emit("keypress", null, { name: audioPart.keyboardKey });
      }
    });
    return await this.call_quiz();
  }
}
