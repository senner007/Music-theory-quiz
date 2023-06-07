import { MathFloor } from "./random-funcs";
import { transpose_to_ascending } from "./transposition";
import { noteAllAccidental, noteAllAccidentalOctave, note_transpose, toOctave, random_index, octave } from "./utils";

declare global {

    interface Array<T> {
      toOctaveAscending(this: noteAllAccidental[], octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
      transposeBy<U extends noteAllAccidental[] | noteAllAccidentalOctave[]>(this: U, interval: string): Readonly<U>;
      commaSequence(): string;
      shuffleArray(): Readonly<Array<T>>;
      randomItem(): T;
      isEmpty(): boolean
    }
    interface ReadonlyArray<T> {
      shuffleArray(): Readonly<Array<T>>;
      randomItem(): T;
      commaSequence(): string;
      toOctaveAscending(this: Readonly<noteAllAccidental[]>, octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
      transposeBy<U extends Readonly<noteAllAccidental[]> | Readonly<noteAllAccidentalOctave[]>>(this: U, interval: string): Readonly<U>;
      isEmpty(): boolean;
    }
  }

  Array.prototype.isEmpty = function<U extends any[]> (
    this: U
  ) : boolean {
    return this.length === 0
  };

  Array.prototype.transposeBy = function<U extends noteAllAccidental[] | noteAllAccidentalOctave[]> (
    this: U,
    interval: string
  ) : Readonly<U> {
    return this.map(n => note_transpose(n, interval)) as Readonly<U>;
  };
  
  
  Array.prototype.toOctaveAscending = function (
    octave: octave
  ): Readonly<noteAllAccidentalOctave[]> {
    return this.map((n) => toOctave(n, octave)).map(transpose_to_ascending);
  };
  
  Array.prototype.commaSequence = function (): string {
    return this.join(", ");
  };
  
  
  Array.prototype.shuffleArray = function () {
    const arrayClone = [...this];
    for (let i = arrayClone.length - 1; i > 0; i--) {
      const j = MathFloor(Math.random() * (i + 1));
      const temp = arrayClone[i];
      arrayClone[i] = arrayClone[j];
      arrayClone[j] = temp;
    }
    return arrayClone;
  };
  
  Array.prototype.randomItem = function () {
    const randomIndex = random_index(this);
    return this[randomIndex];
  };