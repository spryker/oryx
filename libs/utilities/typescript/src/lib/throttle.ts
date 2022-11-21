export const throttle = (
  fn: () => void,
  wait: number,
  deferACall = false
): (() => void) => {
  let deferredCall!: NodeJS.Timeout;

  let lastCalledAt = Date.now();
  let isFirstCall = true;

  return (...args): void => {
    const timeLeftForNextCall = lastCalledAt + wait - Date.now();

    if (isFirstCall || timeLeftForNextCall < 0) {
      lastCalledAt = Date.now();

      fn(...args);
      isFirstCall = false;
    }

    if (deferACall) {
      clearTimeout(deferredCall);
      deferredCall = setTimeout(() => {
        fn(...args);
      }, wait);
    }
  };
};
