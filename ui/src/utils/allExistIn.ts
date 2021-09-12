const allExistIn = (array1: number[], array2: number[]) => {
  let count = 0;

  for (const item of array1) {
    if (array2.includes(item)) {
      count = count + 1;
    }
  }

  return count === array1.length;
};

export default allExistIn;
