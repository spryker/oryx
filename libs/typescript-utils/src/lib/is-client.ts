declare const process: any;

export const isClient = (): boolean => {
  try {
    return !(typeof process !== 'undefined' && process?.versions?.node);
  } catch (e) {
    return true;
  }
};
