const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = () => {
  const northmostItem = new Map();
  const roundRocksRolled = new Set();

  const yLength = input.length;
  const xLength = input[0].length;
  for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
      const character = input[y][x];
      if (character === "#") {
        northmostItem.set(x, y);
      } else if (character === "O") {
        let obstruction = northmostItem.get(x);
        if (obstruction === undefined) {
          obstruction = -1;
        }
        roundRocksRolled.add([x, obstruction + 1]);
        northmostItem.set(x, obstruction + 1);
      }
    }
  }

  return Array.from(roundRocksRolled).reduce(
    (previous, rock) => previous + yLength - rock[1],
    0
  );
};

const roundRocksToString = (roundRocks, obstructions) => {
  let res = "";
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const coords = `${x}#${y}`;
      const yesRound = roundRocks.has(coords);
      const yesObstructions = obstructions.has(coords);
      if (yesRound) {
        if (yesObstructions) {
          res += "!";
        } else {
          res += "O";
        }
      } else if (yesObstructions) {
        res += "#";
      } else {
        res += ".";
      }
    }
    res += "\n";
  }

  return res;
};

const partTwo = () => {
  const yLength = input.length;
  const xLength = input[0].length;

  let roundRocks = new Set();
  const flatRocks = new Set();
  for (let y = 0; y < yLength; y++) {
    for (let x = 0; x < xLength; x++) {
      const character = input[y][x];
      if (character === "#") {
        flatRocks.add(`${x}#${y}`);
      } else if (character === "O") {
        roundRocks.add(`${x}#${y}`);
      }
    }
  }

  let upmostItem;

  // TODO find stable loop
  const fullCyclesMemoized = new Map();
  const setToMemoString = (set) => JSON.stringify(Array.from(set).sort());
  for (let i = 0; i < 1000000000; i++) {
    const memoString = setToMemoString(roundRocks);
    let memoResult = fullCyclesMemoized.get(memoString);
    if (memoResult) {
      let memos = [];
      for (let j = 0; ; j++) {
        const memoStringCheck = setToMemoString(memoResult);
        const memoResultCheck = fullCyclesMemoized.get(memoStringCheck);
        memos[j] = memoResult;

        if (memoStringCheck === memoString) {
            return [
              memos.map((memo) =>
                Array.from(memo).reduce(
                  (previous, rock) =>
                    previous + yLength - Number(rock.split("#")[1]),
                  0
                )
              ),
              i,
              j,
              1000000000
            ];
          //   return memos[(1000000000 - i) % j];
          return Array.from(memos[((1000000000 - i + 1) % j) + 1]).reduce(
            (previous, rock) => previous + yLength - Number(rock.split("#")[1]),
            0
          );
          return ["yay", i, j];
        }
        memoResult = memoResultCheck;
      }
      return ["yay", memoResult, fullCyclesMemoized, i];
      roundRocks = memoResult;
    }
    // XXX I have _no time_ this morning, deliberately writing very repetitive code
    // north
    upmostItem = new Map();
    for (let y = 0; y < yLength; y++) {
      for (let x = 0; x < xLength; x++) {
        const coördinates = `${x}#${y}`;
        if (flatRocks.has(coördinates)) {
          upmostItem.set(x, y);
        } else if (roundRocks.has(coördinates)) {
          let obstruction = upmostItem.get(x);
          if (obstruction === undefined) {
            obstruction = -1;
          }
          roundRocks.delete(coördinates);
          roundRocks.add(`${x}#${obstruction + 1}`);
          upmostItem.set(x, obstruction + 1);
        }
      }
    }

    //   console.log("after north");
    //   console.log(roundRocksToString(roundRocks, flatRocks));

    // west
    upmostItem = new Map();
    for (let x = 0; x < xLength; x++) {
      for (let y = 0; y < yLength; y++) {
        const coördinates = `${x}#${y}`;
        if (flatRocks.has(coördinates)) {
          upmostItem.set(y, x);
        } else if (roundRocks.has(coördinates)) {
          let obstruction = upmostItem.get(y);
          if (obstruction === undefined) {
            obstruction = -1;
          }
          roundRocks.delete(coördinates);
          roundRocks.add(`${obstruction + 1}#${y}`);
          upmostItem.set(y, obstruction + 1);
        }
      }
    }

    //   console.log("after west");
    //   console.log(roundRocksToString(roundRocks, flatRocks));

    // south
    upmostItem = new Map();
    for (let y = yLength - 1; y >= 0; y--) {
      for (let x = xLength - 1; x >= 0; x--) {
        const coördinates = `${x}#${y}`;
        if (flatRocks.has(coördinates)) {
          upmostItem.set(x, y);
        } else if (roundRocks.has(coördinates)) {
          let obstruction = upmostItem.get(x);
          if (obstruction === undefined) {
            obstruction = xLength;
          }
          roundRocks.delete(coördinates);
          roundRocks.add(`${x}#${obstruction - 1}`);
          upmostItem.set(x, obstruction - 1);
        }
      }
    }
    //   console.log("after south");
    //   console.log(roundRocksToString(roundRocks, flatRocks));

    // east
    upmostItem = new Map();
    for (let x = xLength - 1; x >= 0; x--) {
      for (let y = yLength - 1; y >= 0; y--) {
        const coördinates = `${x}#${y}`;
        if (flatRocks.has(coördinates)) {
          upmostItem.set(y, x);
        } else if (roundRocks.has(coördinates)) {
          let obstruction = upmostItem.get(y);
          if (obstruction === undefined) {
            obstruction = yLength;
          }
          roundRocks.delete(coördinates);
          roundRocks.add(`${obstruction - 1}#${y}`);
          upmostItem.set(y, obstruction - 1);
        }
      }
    }

    fullCyclesMemoized.set(memoString, new Set(roundRocks));

    //   console.log("after east");
    //   console.log(roundRocksToString(roundRocks, flatRocks));
    // console.log(roundRocksToString(roundRocks, flatRocks));
  }

  return Array.from(roundRocks).reduce(
    (previous, rock) => previous + yLength - Number(rock.split("#")[1]),
    0
  );
};

// 96063 is too high
// 96064, 96077,
// 96079, 96078,
// 96061, 96064,
// 96063
// just guessed 96061 because it's the only one that is lower than 96063
console.log(partTwo());
