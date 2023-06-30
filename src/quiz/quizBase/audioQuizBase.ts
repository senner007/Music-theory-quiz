
import inquirer from "inquirer";
import { INotePlay, play_midi } from "../../midiplay";
import { IListener, QuizBase } from "./quizBase";
import { bottomBar } from "../../logger/logAsync";
import { stateManager } from "../state/stateManagement";

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

  private TEMPO_MAX = 1000;
  private TEMPO_MIN = 100;
  private TEMPO_DISPLAY_MAX = 10;
  private TEMPO_DISPLAY_MIN = 1;
  private TEMPO_STEP = 100;
  private BACKGROUND_CHANNEL = 10;

  protected tempoText() { return `Tempo : ${this.oppositeSizeInRange(this.get_tempo().tempo)} - Change with key command: Ctrl-(left/right)` };

  private create_listeners(audioParts: IAudioPlay[]): IListener[] {

    return audioParts.map((audioPart) => {
      let abortControl = { ac: new AbortController() };

      const listener = (_: any, key: any) => {
        if (key.name === audioPart.keyboardKey) {
          this.listenersArray
            .filter(l => l.isBackgroundChannel === audioPart.backgroundChannel) // abort everything where backgroundChannel property is equal to current
            .forEach(l => l.acObj?.ac.abort());
          abortControl.ac = new AbortController();
          if (audioPart.display) {
            play_midi(audioPart.audio, abortControl.ac, audioPart.backgroundChannel ? this.BACKGROUND_CHANNEL : 1, this.get_tempo().tempo);
          } else {
            audioPart.audio.forEach((audio, index) => {
              play_midi(audio, abortControl.ac, audioPart.backgroundChannel ? this.BACKGROUND_CHANNEL : index, this.get_tempo().tempo);
            });
          }

        }
      };
      return {
        listener: listener,
        acObj: abortControl,
        isBackgroundChannel: audioPart.backgroundChannel
      };
    });
  }

  private tempo_listener(): IListener {
    const listener = (_: any, key: any) => {
      const tempo = (tempo: number) => {
        this.set_tempo(this.get_tempo().tempo + tempo)
        bottomBar.updateBottomBar("Tempo: " + (this.oppositeSizeInRange(this.get_tempo().tempo)).toString());
      }

      if (key.ctrl && key.name === "left") {
        tempo(this.get_tempo().tempo >= this.TEMPO_MAX ? 0 : this.TEMPO_STEP); // here the max tempo should be derived from each sub class
      }
      if (key.ctrl && key.name === "right") {
        tempo(this.get_tempo().tempo <= this.TEMPO_MIN ? 0 : -this.TEMPO_STEP);
      }

    };
    return {
      listener
    };
  }

  abstract audio(): IAudioPlay[];

  abstract call_quiz(): Promise<string | never>;

  private set_tempo(tempo: number) {
    stateManager.setState(this.constructor.name, { tempo: tempo }); // Set the initial tempo for each instance
  }

  private get_tempo() {
    if (!stateManager.stateIsSet(this.constructor.name)) {
      stateManager.setState(this.constructor.name, { tempo: this.initTempo })
    }
    return stateManager.getState(this.constructor.name);
  }

  protected abstract initTempo: number

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
