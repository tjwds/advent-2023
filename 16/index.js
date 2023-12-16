const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const yLen = input.length;
const xLen = input[0].length;

const fromDirToTransformer = (dir) => {
  if (dir === "north") {
    return (x, y) => [x, y + 1];
  }
  if (dir === "east") {
    return (x, y) => [x + 1, y];
  }
  if (dir === "south") {
    return (x, y) => [x, y - 1];
  }
  //"west"
  return (x, y) => [x - 1, y];
};

let visitedCoordsWithDir;
let visitedCoords;

const toIdString = (fromDirection, newX, newY) =>
  `${fromDirection}#${newX}#${newY}`;
const locationIsEligible = (idString, newX, newY) =>
  newX >= 0 &&
  newX < xLen &&
  newY >= 0 &&
  newY < yLen &&
  // disallow infinite loops
  !visitedCoordsWithDir.has(idString);

const toBeamCoördinates = (fromDirection, x, y) => {
  const beamCoördinates = [];
  const character = input[y][x];

  if (
    character === "|" &&
    (fromDirection === "east" || fromDirection === "west")
  ) {
    ["north", "south"].forEach((splitDirection) => {
      // could probably make this less repetitive
      const [xSplit, ySplit] = fromDirToTransformer(splitDirection)(x, y);
      const idSplit = toIdString(splitDirection, xSplit, ySplit);
      if (locationIsEligible(idSplit, xSplit, ySplit)) {
        beamCoördinates.push([splitDirection, xSplit, ySplit]);
        visitedCoordsWithDir.add(idSplit);
        visitedCoords.add(`${xSplit}#${ySplit}`);
      }
    });
  } else if (
    character === "-" &&
    (fromDirection === "north" || fromDirection === "south")
  ) {
    ["east", "west"].forEach((splitDirection) => {
      const [xSplit, ySplit] = fromDirToTransformer(splitDirection)(x, y);
      const idSplit = toIdString(splitDirection, xSplit, ySplit);
      if (locationIsEligible(idSplit, xSplit, ySplit)) {
        beamCoördinates.push([splitDirection, xSplit, ySplit]);
        visitedCoordsWithDir.add(idSplit);
        visitedCoords.add(`${xSplit}#${ySplit}`);
      }
    });
  } else if (character === "/") {
    let newDirection;
    if (fromDirection === "north") {
      newDirection = "west";
    } else if (fromDirection === "west") {
      newDirection = "north";
    } else if (fromDirection === "east") {
      newDirection = "south";
    } /* if (fromDirection === "south") */ else {
      newDirection = "east";
    }

    const [newX, newY] = fromDirToTransformer(newDirection)(x, y);
    const idString = toIdString(newDirection, newX, newY);
    if (locationIsEligible(idString, newX, newY)) {
      beamCoördinates.push([newDirection, newX, newY]);
      visitedCoordsWithDir.add(idString);
      visitedCoords.add(`${newX}#${newY}`);
    }
  } else if (character === "\\") {
    let newDirection;
    if (fromDirection === "north") {
      newDirection = "east";
    } else if (fromDirection === "west") {
      newDirection = "south";
    } else if (fromDirection === "east") {
      newDirection = "north";
    } /* if (fromDirection === "south") */ else {
      newDirection = "west";
    }

    const [newX, newY] = fromDirToTransformer(newDirection)(x, y);
    const idString = toIdString(newDirection, newX, newY);
    if (locationIsEligible(idString, newX, newY)) {
      beamCoördinates.push([newDirection, newX, newY]);
      visitedCoordsWithDir.add(idString);
      visitedCoords.add(`${newX}#${newY}`);
    }
  } else {
    const [newX, newY] = fromDirToTransformer(fromDirection)(x, y);
    const idString = toIdString(fromDirection, newX, newY);
    if (locationIsEligible(idString, newX, newY)) {
      beamCoördinates.push([fromDirection, newX, newY]);
      visitedCoordsWithDir.add(idString);
      visitedCoords.add(`${newX}#${newY}`);
    }
  }

  return beamCoördinates;
};

const run = (partOne = true) => {
  let result = 0;
  const toStart = [];
  if (partOne) {
    toStart.push(["east", 0, 0]);
  } else {
    // the beam could start on any tile in the top row (heading downward), any tile in the bottom row (heading upward), any tile in the leftmost column (heading right), or any tile in the rightmost column (heading left)
    for (let i = 0; i < xLen; i++) {
      toStart.push(["north", i, 0]);
      toStart.push(["south", i, yLen - 1]);
    }
    for (let i = 0; i < yLen; i++) {
      toStart.push(["east", 0, i]);
      toStart.push(["west", xLen - 1, i]);
    }
  }
  toStart.forEach((group) => {
    const steps = [];
    visitedCoordsWithDir = new Set();
    visitedCoords = new Set();
    steps.push(group);
    visitedCoordsWithDir.add(`${group[0]}#${group[1]}#${group[2]}`);
    visitedCoords.add(`${group[1]}#${group[2]}`);
    let nextStep;
    while ((nextStep = steps.shift())) {
      const res = toBeamCoördinates(...nextStep);
    //   console.log(nextStep, steps, res);
      steps.push(...res);
    }

    if (visitedCoords.size > result) {
      result = visitedCoords.size;
    }
  });

  return result;
};

console.log(run(false));
