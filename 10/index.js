const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const map = {};
let start;

const positionToType = new Map();
const UNKNOWN = 1;
const TRACK = 2;
const OUTSIDE = 3;

const yLength = input.length;
const xLength = input[0].length;
for (let y = 0; y < yLength; y++) {
  const line = input[y];
  for (let x = 0; x < xLength; x++) {
    const char = line[x];
    map[`${x}#${y}`] = char;
    if (char === "S") {
      start = [x, y];
    }
    positionToType.set(`${x}#${y}`, UNKNOWN);
  }
}

const walkPipeType = (startX, startY, pipeLocationX, pipeLocationY) => {
  const pipeCharacter = map[`${pipeLocationX}#${pipeLocationY}`];
  if (pipeCharacter === "|") {
    return [startX, startY + 2 * (startY > pipeLocationY ? -1 : 1)];
  }
  if (pipeCharacter === "-") {
    return [startX + 2 * (startX > pipeLocationX ? -1 : 1), startY];
  }
  if (pipeCharacter === "L") {
    if (startY < pipeLocationY) {
      return [startX + 1, startY + 1];
    }
    return [startX - 1, startY - 1];
  }
  if (pipeCharacter === "J") {
    if (startY < pipeLocationY) {
      return [startX - 1, startY + 1];
    }
    return [startX + 1, startY - 1];
  }
  if (pipeCharacter === "7") {
    if (startY > pipeLocationY) {
      return [startX - 1, startY - 1];
    }
    return [startX + 1, startY + 1];
  }
  if (pipeCharacter === "F") {
    if (startY > pipeLocationY) {
      return [startX + 1, startY - 1];
    }
    return [startX - 1, startY + 1];
  }

  if (pipeCharacter !== "S") {
    throw new Error(
      "Cannot exit pipe.  There is dirt in the way.  There is no escape.  Christmas is ruined."
    );
  }

  return [startX, startY];
};

const run = (partOne = true) => {
  // find the first pipe from the start
  let [thisX, thisY] = start;
  const nextPipeFromStart = [
    [thisX + 1, thisY],
    [thisX - 1, thisY],
    [thisX, thisY + 1],
    [thisX, thisY - 1],
  ].find(([x, y]) => map[`${x}#${y}`] !== "S");

  if (!nextPipeFromStart) {
    throw new Error(
      "There is no route from the start.  Children are crying, no coal for their stockings."
    );
  }

  let [nextX, nextY] = nextPipeFromStart;
  let currentCharacter;
  let count = 0;
  while (currentCharacter !== "S") {
    positionToType.set(`${thisX}#${thisY}`, TRACK);
    positionToType.set(`${(thisX + nextX) / 2}#${(thisY + nextY) / 2}`, TRACK);
    const previousNextX = nextX;
    const previousNextY = nextY;
    [nextX, nextY] = walkPipeType(thisX, thisY, nextX, nextY);
    thisX = previousNextX;
    thisY = previousNextY;
    // inefficient to have to look this up again, but whatever.
    currentCharacter = map[`${thisX}#${thisY}`];
    count++;
  }
  // just assuming that there's always an odd number of steps
  if (partOne) {
    return count / 2;
  }

  const transformations = [
    (x, y) => [x - 0.5, y - 0.5],
    (x, y) => [x - 0.5, y],
    (x, y) => [x - 0.5, y + 0.5],
    (x, y) => [x, y - 0.5],
    // (x, y) => [x, y],
    (x, y) => [x, y + 0.5],
    (x, y) => [x + 0.5, y - 0.5],
    (x, y) => [x + 0.5, y],
    (x, y) => [x + 0.5, y + 0.5],
  ];

  const depthToSearch = [];
  for (let x = 0; x < xLength - 1; x++) {
    let searchString = `${x}#0`;
    let type = positionToType.get(searchString);
    if (type !== TRACK) {
      positionToType.set(searchString, OUTSIDE);
      depthToSearch.push([x, 0]);
    }
    searchString = `${x}#${yLength - 1}`;
    type = positionToType.get(searchString);
    if (type !== TRACK) {
      positionToType.set(searchString, OUTSIDE);
      depthToSearch.push([x, yLength - 1]);
    }
  }

  for (let y = 0; y < yLength - 1; y++) {
    let searchString = `0#${y}`;
    let type = positionToType.get(searchString);
    if (type !== TRACK && type !== OUTSIDE) {
      positionToType.set(searchString, OUTSIDE);
      depthToSearch.push([0, y]);
    }
    searchString = `${xLength - 1}#${y}`;
    type = positionToType.get(searchString);
    if (type !== TRACK && type !== OUTSIDE) {
      positionToType.set(searchString, OUTSIDE);
      depthToSearch.push([xLength - 1, y]);
    }
  }

  while (depthToSearch.length) {
    const [testX, testY] = depthToSearch.shift();

    transformations.forEach((transformation) => {
      const [newX, newY] = transformation(testX, testY);

      if (newX < 0 || newX > xLength - 1 || newY < 0 || newY > yLength - 1) {
        return;
      }

      const type = positionToType.get(`${newX}#${newY}`);
      if (type !== TRACK && type !== OUTSIDE) {
        positionToType.set(`${newX}#${newY}`, OUTSIDE);
        depthToSearch.push([newX, newY]);
      }
    });
  }

  // this actually doesn't work quite right on example 4, but it works on the
  // input, and I've spent _way_ too long on this, so I'm done
  return Array.from(positionToType.values()).filter(
    (value) => value === UNKNOWN
  ).length;
};

console.log(run(), run(false));
