const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const run = (partOne = true) => {
  // find rows that should be expanded:
  const expandYIndex = [];
  input.forEach((row, index) => {
    if (!row.match(/#/)) {
      expandYIndex.push(index);
    }
  });

  const expandXIndex = [];
  xLoop: for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input.length; y++) {
      if (input[y][x] === "#") {
        continue xLoop;
      }
    }

    expandXIndex.push(x);
  }

  // expand universe and map galaxies
  const galaxies = [];
  let realY = 0;
  for (let y = 0; y < input.length; y++) {
    if (expandYIndex.includes(y)) {
      realY += partOne ? 1 : 1_000_000 - 1;
    }

    let realX = 0;
    for (let x = 0; x < input.length; x++) {
      if (expandXIndex.includes(x)) {
        realX += partOne ? 1 : 1_000_000 - 1;
      }

      if (input[y][x] === "#") {
        galaxies.push([realX, realY]);
      }
      realX++;
    }

    realY++;
  }

  let sumOfLengths = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const [startX, startY] = galaxies[i];

    for (let j = i + 1; j < galaxies.length; j++) {
      const [compareX, compareY] = galaxies[j];

      sumOfLengths += Math.abs(startX - compareX)
      sumOfLengths += Math.abs(startY - compareY)
    }
  }

  return sumOfLengths;
};

console.log(run(), run(false));
