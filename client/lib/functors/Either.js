class Either {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Right(x);
  }
}

class Right extends Either {
  map(fn) {
    return Either.of(fn(this.$value));
  }
}

class Left extends Either {
  map(fn) {
    return this;
  }

  static of(x) {
    return new Left(x);
  }
}

module.exports = {
  Either,
  Right,
  Left
};
