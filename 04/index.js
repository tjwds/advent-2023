const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = input.reduce((previous, line) => {
  let matches = 0;

  const [, trimmed] = line.split(":");
  const [winnersString, ourNumbersString] = trimmed.split("|");

  const winners = new Set(winnersString.split(" ").filter(Boolean));

  // maybe next year Set.prototype.intersection will have shipped
  // https://github.com/tc39/proposal-set-methods
  ourNumbersString.split(" ").forEach((ourNumber) => {
    if (!ourNumber) {
      return;
    }

    if (winners.has(ourNumber)) {
      matches += 1;
    }
  });

  return previous + (matches ? 2 ** (matches - 1) : 0);
}, 0);

const partTwo = () => {
  /*
      id => {
        numberWinners: Number,
        copies: Number,
      }
  */
  const cards = new Map();
  let visited = 0;

  input.forEach((line) => {
    const [idString, trimmed] = line.split(":");
    const [winnersString, ourNumbersString] = trimmed.split("|");
    const id = Number(idString.split(" ").at(-1));

    const winners = new Set(winnersString.split(" ").filter(Boolean));
    const ourNumbers = ourNumbersString.split(" ").filter(Boolean);
    winnersCount = ourNumbers.reduce(
      (previous, number) => previous + !!winners.has(number),
      0
    );

    cards.set(id, {
      copies: 1,
      winnersCount,
    });
  });

  for (let i = 1; i <= input.length; i++) {
    const line = cards.get(i);

    for (let j = i + 1; j <= i + line.winnersCount; j++) {
      if (j > input.length) {
        break;
      }
      const toModify = cards.get(j);
      toModify.copies = toModify.copies + line.copies;
    }
  }

  for (let i = 1; i <= input.length; i++) {
    const { copies } = cards.get(i);
    visited += copies;
  }

  return visited;
};

console.log(partOne, partTwo());
