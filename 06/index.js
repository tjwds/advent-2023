const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const timeToDistance = input
  .split("\n")
  .map((line) => line.split(" ").filter(Boolean).splice(1).map(Number));

const partOne = () => {
  let breakRecords = 1;

  for (let i = 0; i < timeToDistance[0].length; i++) {
    const time = timeToDistance[0][i];
    const distance = timeToDistance[1][i];

    let recordBeaters = 0;
    for (let j = 0; j <= time; j++) {
      const traveled = j * (time - j);
      if (traveled > distance) {
        recordBeaters++;
      }
    }
    if (recordBeaters > 0) {
      breakRecords *= recordBeaters;
    }
  }

  return breakRecords;
};

const partTwo = () => {
  const time = Number(timeToDistance[0].join(""));
  const distance = Number(timeToDistance[1].join(""));

  let recordBeaters = 0;
  for (let j = 0; j <= time; j++) {
    const traveled = j * (time - j);
    if (traveled > distance) {
      recordBeaters++;
    }
  }

  return recordBeaters;
};

console.log(partOne(), partTwo());
