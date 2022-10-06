const getRandomIntFromRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const getRandomString = (): string =>
  Math.random().toString(getRandomIntFromRange(16, 36)).substring(2);

export const generateID = (num = 1): string =>
  Array.from({ length: Math.abs(Number(num)) || 1 }, getRandomString)
    .join('-')
    .toUpperCase();
