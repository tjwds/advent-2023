const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const run = (partOne = true) => {
  return input.reduce((previous, lineString) => {
    const line = lineString.split(" ").map(Number);
    const sequences = [line];

    while (true) {
      let sequence = sequences.at(-1);
      let newSequence = [];
      sequences.push(newSequence);

      for (let j = 0; j < sequence.length - 1; j++) {
        newSequence.push(sequence[j + 1] - sequence[j]);
      }

      if (newSequence.every((val) => val === 0)) {
        break;
      }
    }

    const lastSequence = sequences.at(-1);
    lastSequence[partOne ? "push" : "unshift"](0);

    for (let i = sequences.length - 2; i >= 0; i--) {
      const targetSequence = sequences.at(i);
      const comparisonNumber = sequences.at(i + 1).at(partOne ? -1 : 0);

      targetSequence[partOne ? "push" : "unshift"](
        targetSequence.at(partOne ? -1 : 0) +
          comparisonNumber * (partOne ? 1 : -1)
      );
    }

    return previous + sequences.at(0).at(partOne ? -1 : 0);
  }, 0);
};

console.log(run(), run(false));
