'use strict';

// Rewrite code from examples 1,2,3 using this Monad
// do not change code of Monad

class Monad {
  #value;

  constructor(value) {
    this.#value = value;
  }

  static of(value) {
    return new Monad(value);
  }

  map(fn) {
    return Monad.of(fn(this.#value));
  }

  chain(fn) {
    return fn(this.#value);
  }

  ap(container) {
    const fn = this.#value;
    return container.map(fn);
  }
}

const createAdder = (initial) => {
  return Monad.of(initial);
};
const add = (x) => (y) => x + y;
const log = (x) => console.log('Result:', +x);

const result = createAdder(1).map(add(9)).map(add(1)).map(add(7)).chain(log);

