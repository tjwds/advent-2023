const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/example.txt"))
  .toString()
  .split("\n");

const createPathsForLine = (line, paths = []) => {
  let nextIndex = line.indexOf("?");
  if (nextIndex === -1) {
    paths.push(line);
    return paths;
  }

  createPathsForLine(
    line.slice(0, nextIndex) + "." + line.slice(nextIndex + 1, line.length),
    paths
  );
  createPathsForLine(
    line.slice(0, nextIndex) + "#" + line.slice(nextIndex + 1, line.length),
    paths
  );

  return paths;
};

const run = (partOne = true) => {
  return input.reduce((totalArrangements, inputLine) => {
    const [originalLine, originalTest] = inputLine.split(" ");
    let line = originalLine;
    let test = originalTest;
    if (!partOne) {
      for (let i = 0; i < 5; i++) {
        line += "?" + originalLine;
        test += "," + originalTest;
      }
    }
    const resultLengths = test.split(",").map(Number);

    const paths = createPathsForLine(line);
    const thisLineArrangements = paths.filter((line) => {
      const lineLengths = line
        .split(".")
        .filter(Boolean)
        .map((string) => string.length);

      if (lineLengths.length !== resultLengths.length) {
        return false;
      }
      for (let i = 0; i < resultLengths.length; i++) {
        if (lineLengths[i] !== resultLengths[i]) {
          return false;
        }
      }
      return true;
    }).length;

    console.log(`${line} has ${thisLineArrangements} possible arrangements`);

    return thisLineArrangements + totalArrangements;
  }, 0);
};

console.log(run());
