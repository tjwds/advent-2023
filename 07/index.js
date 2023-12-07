const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n")
  .map((line) => line.split(" "));

const PART_TWO = true;

const HIGH_CARD = 1;
const ONE_PAIR = 2;
const TWO_PAIR = 3;
const THREE_OF_A_KIND = 4;
const FULL_HOUSE = 5;
const FOUR_OF_A_KIND = 6;
const FIVE_OF_A_KIND = 7;

let addBestToQualification = (qualification) => {
  if (qualification === ONE_PAIR) {
    return THREE_OF_A_KIND;
  }
  if (qualification === TWO_PAIR) {
    return FULL_HOUSE;
  }
  if (qualification === THREE_OF_A_KIND) {
    return FOUR_OF_A_KIND;
  }
  if (qualification === FIVE_OF_A_KIND) {
    return FIVE_OF_A_KIND;
  }

  // +1 for FOUR_OF_A_KIND, FULL_HOUSE, HIGH_CARD
  return qualification + 1;
};

const qualifyHand = (hand) => {
  if (hand.qualification) {
    return hand.qualification;
  }
  const figures = {};
  hand[0].split("").forEach((card) => {
    if (!figures[card]) {
      figures[card] = 0;
    }
    figures[card] = figures[card] + 1;
  });

  const numberOfJacks = figures["J"] || 0;
  // XXX I had to manually look through the entire list to find this bug.
  if (PART_TWO) {
    figures["J"] = 0;
  }
  let qualification = HIGH_CARD;
  const numbersOfRank = Object.values(figures);
  if (numbersOfRank.includes(5)) {
    qualification = FIVE_OF_A_KIND;
  } else if (numbersOfRank.includes(4)) {
    qualification = FOUR_OF_A_KIND;
  } else if (numbersOfRank.includes(3)) {
    if (numbersOfRank.includes(2)) {
      qualification = FULL_HOUSE;
    } else {
      qualification = THREE_OF_A_KIND;
    }
  } else if (numbersOfRank.includes(2)) {
    const numberOfPairs = numbersOfRank.filter((n) => n === 2).length;
    if (numberOfPairs >= 2) {
      qualification = TWO_PAIR;
    } else {
      qualification = ONE_PAIR;
    }
  }

  if (PART_TWO) {
    for (let i = 0; i < numberOfJacks; i++) {
      qualification = addBestToQualification(qualification);
    }
  }

  hand.qualification = qualification;
  return qualification;
};

const charsToNumbers = {
  T: 10,
  // XXX didn't use 0 out of laziness
  J: PART_TWO ? -1 : 11,
  Q: 12,
  K: 13,
  A: 14,
};

const cardToValue = (char) => charsToNumbers[char] || Number(char);

const run = () => {
  return input
    .sort((lineA, lineB) => {
      const qualificationA = qualifyHand(lineA);
      const qualificationB = qualifyHand(lineB);

      if (qualificationA > qualificationB) {
        return 1;
      }
      if (qualificationB > qualificationA) {
        return -1;
      }

      const handA = lineA[0];
      const handB = lineB[0];
      for (let i = 0; i < 5; i++) {
        const rankA = cardToValue(handA[i]);
        const rankB = cardToValue(handB[i]);

        if (rankA > rankB) {
          return 1;
        }
        if (rankB > rankA) {
          return -1;
        }
      }

      // this should never happen
      throw new Error(`${lineA} and ${lineB} are equal…?`);
    })
    .reduce(
      (previous, next, index) => previous + Number(next[1]) * (index + 1),
      0
    );
};

console.log(run());
