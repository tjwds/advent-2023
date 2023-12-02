const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = () => {
  let gameSum = 0;

  gameLine: for (let i = 0; i < input.length; i++) {
    const game = input[i];
    const [, gameId, resultsString] = game.match(/Game ([0-9]+): (.*)/);
    const results = resultsString.split("; ");

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const redResults = Number(result.match(/([0-9]+) red/)?.[1] || 0);
      const greenResults = Number(result.match(/([0-9]+) green/)?.[1] || 0);
      const blueResults = Number(result.match(/([0-9]+) blue/)?.[1] || 0);

      // only 12 red cubes, 13 green cubes, and 14 blue cubes
      if (redResults > 12 || greenResults > 13 || blueResults > 14) {
        continue gameLine;
      }
    }

    gameSum += Number(gameId);
  }

  return gameSum;
};

const partTwo = () => {
  let powers = 0;

  for (let i = 0; i < input.length; i++) {
    const greatests = {
      red: 0,
      green: 0,
      blue: 0,
    };
    const game = input[i];
    const [, gameId, resultsString] = game.match(/Game ([0-9]+): (.*)/);
    const results = resultsString.split("; ");

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const redResults = Number(result.match(/([0-9]+) red/)?.[1] || 0);
      const greenResults = Number(result.match(/([0-9]+) green/)?.[1] || 0);
      const blueResults = Number(result.match(/([0-9]+) blue/)?.[1] || 0);

      if (redResults > greatests.red) {
        greatests.red = redResults;
      }
      if (greenResults > greatests.green) {
        greatests.green = greenResults;
      }
      if (blueResults > greatests.blue) {
        greatests.blue = blueResults;
      }
    }

    const power = greatests.red * greatests.green * greatests.blue;
    powers += power;
  }

  return powers;
};

console.log(partTwo());
