import { LogError } from "./dev-utils";
import { math_floor } from "./random_func";
import { note_transpose } from "./tonal-interface";
import { transpose_to_ascending } from "./transposition";
import { TNoteAllAccidental, TNoteAllAccidentalOctave, to_octave, random_index, TOctave, TIntervalInteger } from "./utils";

type Last<T extends readonly any[]> = [any, ...T][T["length"]];
export type Reverse<T extends readonly any[]> = T extends readonly [infer F, ...infer Rest] ? [...Reverse<Rest>, F] : T;


declare global {

  interface Array<T> {
    to_octave_ascending(this: TNoteAllAccidental[], octave: TOctave): Readonly<Array<TNoteAllAccidentalOctave>>;
    transpose_by<U extends TNoteAllAccidental[] | TNoteAllAccidentalOctave[]>(this: U, interval: TIntervalInteger): Readonly<U>;
    comma_sequence(): string;
    shuffle_array(): Readonly<Array<T>>;
    random_item(): T;
    is_empty(): boolean
    at_or_throw(index: number): T
    first_and_only(): this[0];
    first(): this[0];
    remove_duplicate_objects(): Readonly<Array<T>>;
    contains(this: T[], otherArray: T[]): boolean
    last(): Last<this>;
    to_reverse(): Reverse<this>;
  }
  interface ReadonlyArray<T> extends Array<T> {

  }
}

Array.prototype.to_reverse = function <U extends any[]>(this: U) {
  return this.slice(0).reverse() as Reverse<U>
}

Array.prototype.remove_duplicate_objects = function <U extends any[]>(this: U) {
  return this.filter(
    (chord, index, self) =>
      index === self.findIndex((c) => JSON.stringify(c) === JSON.stringify(chord))
  );
}

Array.prototype.contains = function <U extends any[]>(
  this: U,
  otherArray: U
) {
  return otherArray.every(element => this.includes(element));
};

Array.prototype.is_empty = function <U extends any[]>(
  this: U
) {
  return this.length === 0
};


Array.prototype.at_or_throw = function <U extends any[]>(
  this: U,
  index: number
): U {
  if (this.at(index) === undefined) {
    LogError("Invalid array index called!")
  }
  return this.at(index);
};


Array.prototype.first = function <U extends any[]>(
  this: U
): U[0] {
  return this.at(0);
};

Array.prototype.last = function <U extends any[]>(
  this: U
) {
  return this.at(-1)
};

Array.prototype.first_and_only = function <U extends any[]>(
  this: U
) {
  if (this.length !== 1) {
    LogError("'firstAndOnly' called on array of length not 1")
  }
  return this.first();
};

Array.prototype.transpose_by = function <U extends TNoteAllAccidental[] | TNoteAllAccidentalOctave[]>(
  this: U,
  interval: TIntervalInteger
) {
  return this.map(n => note_transpose(n, interval)) as U;
};


Array.prototype.to_octave_ascending = function (
  octave: TOctave
) {
  return this.map((n) => to_octave(n, octave)).map(transpose_to_ascending);
};

Array.prototype.comma_sequence = function (): string {
  return this.join(", ");
};


Array.prototype.shuffle_array = function () {
  const arrayClone = [...this];
  for (let i = arrayClone.length - 1; i > 0; i--) {
    const j = math_floor(Math.random() * (i + 1));
    const temp = arrayClone[i];
    arrayClone[i] = arrayClone[j];
    arrayClone[j] = temp;
  }
  return arrayClone;
};

Array.prototype.random_item = function () {
  const randomIndex = random_index(this);
  return this[randomIndex];
};