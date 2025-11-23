'use strict';

// Rewrite previous example from OOP with mutable state
// to FP using closure-based syntax, mutable instance, method chaining

class Adder {
  constructor(initial) {
    this.value = initial;
  }

  add(x) {
    this.value += x;
    return this;
  }

  valueOf() {
    return this.value;
  }
}


function createAdder(initial) {
  let value = initial;
  return {
    add(x) {
      value += x;
      return this;
    },
    valueOf() { return value; },
  };
};

// const sum1 = new Adder(1).add(9).add(1).add(7);
const sum1 = createAdder(1).add(9).add(1).add(7);
console.log('Sum:', +sum1);
