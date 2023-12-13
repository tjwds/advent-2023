const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const run = (partOne = true) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));
  let total = 0;
  for (let i = 0; i < patterns.length; i++) {
    console.log("\n");
    const pattern = patterns[i];
    console.log(pattern.join("\n"));
    console.log(`checking pattern ${i}`);
    const yLength = pattern.length;
    const xLength = pattern[0].length;

    // pick a column to iterate over
    columnLoop: for (let numColumns = 1; numColumns < xLength; numColumns++) {
      let usedSmudge = partOne;
      for (let y = 0; y < yLength; y++) {
        let addColumns = 0;
        for (let x = numColumns; x > 0; x--) {
          // XXX silly hack
          const rightSide = pattern[y][numColumns + addColumns];
          if (rightSide === undefined) {
            break;
          }

          if (pattern[y][x - 1] !== rightSide) {
            if (usedSmudge) {
              continue columnLoop;
            }
            usedSmudge = true;
          }
          addColumns++;
        }
      }

      if (partOne || usedSmudge) {
        console.log(
          "vertical symmetry at ",
          numColumns,
          total,
          total + numColumns
        );
        total += numColumns;
      }
      // "Each line of reflection" ??
      //  break;
    }

    // XXX do some have both vertical and horizontal symmetry?
    // This one is _so much_ easier, we can just compare strings.
    rowLoop: for (let numRows = 1; numRows < yLength; numRows++) {
      let usedSmudge = partOne;
      let addRows = 0;
      for (let y = numRows; y > 0; y--) {
        // XXX silly hack again
        const bottomSide = pattern[numRows + addRows];
        const topSide = pattern[y - 1];
        if (bottomSide === undefined) {
          break;
        }
        if (topSide !== bottomSide) {
          if (usedSmudge) {
            continue rowLoop;
          }
          // it needs to be exactly one character difference
          let usedCharacter = false;
          for (let x = 0; x < bottomSide.length; x++) {
            if (topSide[x] !== bottomSide[x]) {
              if (usedCharacter) {
                continue rowLoop;
              }
              usedCharacter = true;
            }
          }
          usedSmudge = true;
        }
        addRows++;
      }

      if (partOne || usedSmudge) {
        console.log(
          "horizontal symmetry at ",
          numRows,
          total,
          total + numRows * 100
        );
        total += numRows * 100;
      }
      // "Each line of reflection" ??
      //  break;
    }
  }
  return total;
};

console.log(run(true));
