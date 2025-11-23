'use strict';

const fs = require('node:fs');

class Future {
  #computation;
  constructor(computation) {
    this.#computation = computation;
  }

  map(fn) {
    return new Future((reject, resolve) => {
      this.fork(
        reject,
        (value) => resolve(fn(value))
      );
    });
  }

  chain(fn) {
    return new Future((reject, resolve) => {
      this.fork(
        reject,
        (value) => fn(value).fork(reject, resolve)
      );
    });
  }

  fork(reject, resolve) {
    this.#computation(reject, resolve);
  }
}

const futurify = (fn) =>
  (...args) =>
    new Future((reject, resolve) =>
      fn(...args, (error, result) =>
        error ? reject(error) : resolve(result),
      ),
    );

const readFuture = futurify(fs.readFile);
const writeFuture = futurify(fs.writeFile);

readFuture('future.js', 'utf8')
  .map((text) => text.toUpperCase())
  .chain((text) => writeFuture('future.md', text))
  .fork(
    (error) => console.error('FS error:', error),
    () => console.log('Done'),
  );
