const { compose } = require("rambda");

class IO {
  constructor(fn) {
    this.$value = fn;
  }

  static of(x) {
    return new IO(() => x);
  }

  map(fn) {
    return new IO(compose(fn, this.$value));
  }
};

module.exports = IO;
