const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const instructions = input[0];
const locationToNext = {};

for (let i = 2; i < input.length; i++) {
  const line = input[i];
  const [start, locations] = line.split(" = ");
  const [left, right] = locations.slice(1, -1).split(", ");
  locationToNext[start] = { L: left, R: right };
}

const calculateGCD = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const calculateLCM = (numbers) => {
  let lcm = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    const gcd = calculateGCD(lcm, numbers[i]);
    lcm = (lcm * numbers[i]) / gcd;
  }
  return lcm;
};

const partOne = () => {
  let steps = 0;
  let current = "AAA";
  while (true) {
    const instruction = instructions[steps % instructions.length];
    steps += 1;

    current = locationToNext[current][instruction];

    if (current === "ZZZ") {
      return steps;
    }
  }
};

const partTwo = () => {
  let currents = Object.keys(locationToNext).filter((location) =>
    location.endsWith("A")
  );
  const currentsToStepsToComplete = {};

  currents.forEach((startCurrent) => {
    let steps = 0;
    let current = startCurrent;
    while (true) {
      const instruction = instructions[steps % instructions.length];
      steps += 1;

      current = locationToNext[current][instruction];

      if (current.endsWith("Z")) {
        // Confirmed with code that this is always a loop (n.b. that next step is the inverse of the start step)
        currentsToStepsToComplete[startCurrent] = steps;
        return;
      }
    }
  });

  return calculateLCM(Object.values(currentsToStepsToComplete));
};

console.log(partOne(), partTwo());
