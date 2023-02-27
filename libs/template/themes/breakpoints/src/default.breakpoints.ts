import { ThemeBreakpoints } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';

export const defaultBreakpoints: ThemeBreakpoints = {
  [Size.Sm]: {
    min: 0,
    max: 767,
  },
  [Size.Md]: {
    min: 768,
  },
  [Size.Lg]: {
    min: 1024,
  },
};
