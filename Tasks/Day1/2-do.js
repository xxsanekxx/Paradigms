'use strict';

// Put implementation here in class syntax
class Do {
  constructor(value) {
    this.value = value;
    this.bindings = [];
  }

  bind(fn) {
    this.bindings.push(fn);
    return this;
  }

  run() {
    return (callback) => {
      let nextValue = this.value;

      for (const fn of this.bindings) {
        nextValue = fn(nextValue);
        if (typeof nextValue === 'function') {
          nextValue(callback);
        } else {
          callback(nextValue);
        }
      }
      
      this.value = {...this.value, ...nextValue};
      this.bindings = [];

      return this;
    };
  }
}

new Do({ id: 15 })
  .bind(({ id }) => ({ id, name: 'marcus', age: 42 }))
  .bind(({ name, age }) => (name === 'marcus' ? (log) => log(age) : () => {}))
  .run()(console.log)
