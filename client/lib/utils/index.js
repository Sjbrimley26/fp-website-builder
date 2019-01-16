const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getLetter = () => {
  const min = 65;
  const max = 90;
  const isLowercase = Math.random() > 0.5;
  const letter = String.fromCharCode(getRandom(min, max));
  return isLowercase ? letter.toLowerCase() : letter;
};

const range = max => {
  const arr = [];
  for (let i = 0; i < max; i++) {
    arr.push(i);
  }
  return arr;
};

const getId = () => {
  let id = "";
  range(10).forEach(() => id += getLetter());
  id += new Date().getMilliseconds();
  return id;
};

module.exports = {
  getRandom,
  getLetter,
  range,
  getId
};