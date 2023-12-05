const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const run = (partOne = false) => {
  let seeds = [];
  let currentMapTransformers = [];
  const maps = [];

  input.forEach((line, index) => {
    if (!index) {
      seedList = line.split("seeds: ")[1].split(" ").map(Number);
      if (partOne) {
        seeds = seedList;
      } else {
        let operations = 0;
        for (let i = 0; i < seedList.length; i += 2) {
          operations += seedList[i + 1];
        }
        console.log(`will be ${operations} operations`);

        const seedMaker = function* () {
          for (let i = 0; i < seedList.length; i += 2) {
            console.log("on seed group", i);
            let start = seedList[i];
            let max = seedList[i + 1] + start;

            for (let j = start; j < max; j++) {
              yield j;
            }
          }
        };

        seeds = seedMaker();
      }
      return;
    }

    // grab the maps in order
    if (!line.match(/^[0-9]/)) {
      // XXX hacky, ugh
      if (line === "" && index !== 1) {
        maps.push(currentMapTransformers);
        currentMapTransformers = [];
      }
      return;
    }

    // turn each line of the map into a transformer function
    const [destinationRangeStart, sourceRangeStart, range] = line
      .split(" ")
      .map(Number);
    const maxRange = sourceRangeStart + range - 1;

    currentMapTransformers.push((number) => {
      if (number >= sourceRangeStart && number <= maxRange) {
        return destinationRangeStart + (number - sourceRangeStart);
      }

      return number;
    });
  });
  // don't forget the last one
  maps.push(currentMapTransformers);

  let lowest = Infinity;
  // for each seed, walk through maps
  for (number of seeds) {
    // does this map line transform this seed?
    // XXX very much hoping that ranges don't overlap
    mapFor: for (let j = 0; j < maps.length; j++) {
      const map = maps[j];

      for (let k = 0; k < map.length; k++) {
        const transformed = map[k](number);

        // if so, _break and go to the next map_
        if (number !== transformed) {
          number = transformed;
          continue mapFor;
        }
      }
    }

    // store the lowest number
    if (number < lowest) {
      lowest = number;
    }
  }

  return lowest;
};

const partTwo = () => {
  let lowest = 0;

  // generate an "is a seed" function
  // generate maps again, but the inverse way
  // start at lowest possible location, walk _backwards_ through maps
  // if it's a seed, we're done

  return lowest;
};

console.log(run());
