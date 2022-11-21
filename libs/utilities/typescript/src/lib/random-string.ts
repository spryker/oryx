export const getRandomString = (): string => {
  const dec2hex = (dec: number): string => ('0' + dec.toString(16)).substr(-2);
  const array = new Uint32Array(56 / 2);
  self.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
};
