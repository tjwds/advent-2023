const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();
const inputNested = input.split("\n").map((line) => line.split(""));

const inputYLength = inputNested.length;
const inputXLength = inputNested[0].length;
const coordinateToCharacter = {};
// make a map of x#y for input
for (let y = 0; y < inputYLength; y++) {
  for (let x = 0; x < inputXLength; x++) {
    coordinateToCharacter[`${x}#${y}`] = inputNested[y][x];
  }
}

const positionToNeighbors = (position) => {
  const [x, y] = position.split("#").map(Number);

  return [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    // [x, y],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ]
    .map(([x, y]) =>
      x >= 0 && x < inputXLength && y >= 0 && y < inputYLength
        ? `${x}#${y}`
        : null
    )
    .filter(Boolean);
};

const run = () => {
  let thisSetOfNumbers = [];
  let sum = 0; // for part one

  let gears = {};

  // for character in input, walk until we start seeing a number
  for (let y = 0; y < inputYLength; y++) {
    for (let x = 0; x < inputXLength; x++) {
      const thisCoordinate = `${x}#${y}`;
      const thisNumber = coordinateToCharacter[thisCoordinate];
      if (thisNumber.match(/[0-9]/)) {
        // when we see a number, collect the number
        thisSetOfNumbers.push(thisCoordinate);
      }

      // make sure we also do this on the last trip around
      if (!thisNumber.match(/[0-9]/) || x === inputXLength - 1) {
        if (thisSetOfNumbers.length) {
          // turn the numbers into neighbors
          const neighbors = new Set();
          thisSetOfNumbers.forEach((number) => {
            const neighborCoordinates = positionToNeighbors(number);
            neighborCoordinates.forEach((coord) => neighbors.add(coord));
          });

          // parse the neighbors:  if there's a symbol, add it to the sum
          const neighborArray = Array.from(neighbors);
          if (
            neighborArray.some((str) =>
              coordinateToCharacter[str].match(/(?:[^0-9.])/)
            )
          ) {
            const partNumber = Number(
              thisSetOfNumbers.map((str) => coordinateToCharacter[str]).join("")
            );
            sum += partNumber;

            // inefficient but whatever
            for (let i = 0; i < neighborArray.length; i++) {
              const position = neighborArray[i];
              const char = coordinateToCharacter[position];
              if (char === "*") {
                if (!gears[position]) {
                  gears[position] = [];
                }
                gears[position].push(partNumber);

                if (gears[position].length > 2) {
                  throw new Error(
                    `${gears[position]} has too many adjacent parts`
                  );
                }
              }
            }
          }

          // reset for the next trip
          thisSetOfNumbers = [];
        }
      }
    }
  }

  let gearRatioTotal = 0;
  Object.values(gears).forEach((gears) => {
    if (gears.length === 1) {
      return;
    }

    gearRatioTotal += gears[0] * gears[1];
  });

  return [sum, gearRatioTotal];
};

console.log(run());
