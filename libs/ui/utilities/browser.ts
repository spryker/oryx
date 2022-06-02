export const isSafari = (): boolean =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const nonFocusableOnClickInSafari = [
  'button',
  'input[type="radio"]',
  'input[type="checkbox"]',
  'input[type="submit"]',
];
