const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const numberWordsToNumber = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const toNumberString = (number) => {
  if (!Number.isNaN(Number(number))) {
    return number;
  }
  return numberWordsToNumber[number];
};

const run = (partOne = true) =>
  input
    .map((line) => {
      const numbers = partOne
        ? Array.from(line.matchAll("[0-9]"))
        : Array.from(
            line.matchAll(
              /(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))/g
            )
          ).map((match) => match[1]);

      return Number(
        toNumberString(numbers.at(0)) + toNumberString(numbers.at(-1))
      );
    })
    .reduce((a, b) => a + b, 0);

console.log(run(false));
