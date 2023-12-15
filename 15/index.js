const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split(",");

const HASH = (string) => {
  let current = 0;
  for (let i = 0; i < string.length; i++) {
    current += string[i].charCodeAt();
    current *= 17;
    current = current % 256;
  }

  return current;
};

const partOne = () =>
  input.reduce((previous, next) => previous + HASH(next), 0);

const partTwo = () => {
  const HASHMAP = new Map();

  input.forEach((sequence) => {
    if (sequence.endsWith("-")) {
      const id = sequence.slice(0, -1);
      const box = HASH(id);
      const boxContents = HASHMAP.get(box);
      if (boxContents) {
        const newContents = boxContents.filter(([_id]) => _id !== id);
        if (newContents.length) {
          HASHMAP.set(box, newContents);
        } else {
          HASHMAP.delete(box);
        }
      }
      return;
    }

    const [id, focalLengthString] = sequence.split("=");
    const box = HASH(id);
    const boxContents = HASHMAP.get(box);
    if (!boxContents) {
      HASHMAP.set(box, [[id, focalLengthString]]);
      return;
    }
    let didReplace = false;
    const newBoxContents = [];
    for (let i = 0; i < boxContents.length; i++) {
      const contents = boxContents[i];
      if (contents[0] === id) {
        contents[1] = focalLengthString;
        didReplace = true;
      }

      newBoxContents.push(contents);
    }
    if (!didReplace) {
      newBoxContents.push([id, focalLengthString]);
    }
    HASHMAP.set(box, newBoxContents);
  });

  let result = 0;
  Array.from(HASHMAP).forEach(([boxId, boxContents]) => {
    boxContents.forEach(([, focalLengthString], slot) => {
      result += (boxId + 1) * (slot + 1) * Number(focalLengthString);
    });
  });

  return result;
};

console.log(partTwo());
