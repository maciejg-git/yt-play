export function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ifMinAddDigit(value) {
  return value < 10 ? '0' + value : value;
}
