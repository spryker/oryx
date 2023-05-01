import { Breakpoints, Size } from '@spryker-oryx/utilities';

export const defaultBreakpoints: Breakpoints = {
  [Size.Sm]: {
    min: 0,
    max: 767,
  },
  [Size.Md]: {
    min: 768,
    max: 1023,
  },
  [Size.Lg]: {
    min: 1024,
  },
};
