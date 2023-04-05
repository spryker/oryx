import { ThemeToken } from '@spryker-oryx/core';

export const typographyTokens: ThemeToken = {
  typography: {
    font: {
      face: '"Montserrat", sans-serif',
      size: '14px',
      weight: '500',
    },
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: { size: '1.285em', line: '1.3636363636em', weight: '600' },
    h2: { size: '1.2857142857em', line: '1.4444444444em', weight: '700' },
    h3: { size: '1.1428571429em', line: '1.375em', weight: '600' },
    h4: { size: '1em', line: '1.5714285714em', weight: '600' },
    h5: { size: '1em', line: '1.5714285714em', weight: '700' },
    h6: { size: '0.8571428571em', line: '1.3333333333em', weight: '600' },
    subtitle: { size: '1em', line: '1.5714285714em', weight: '600' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.1428571429em', line: '1.3333333333em', weight: '600' },
    h2: { size: '1.8571428571em', line: '1.4615384615em', weight: '600' },
    h3: { size: '1.4285714286em', line: '1.4em', weight: '600' },
    h4: { size: '1.2857142857em', line: '1.4444444444em', weight: '600' },
    h5: { size: '1.1428571429em', line: '1.375em', weight: '600' },
    h6: { size: '1.1428571429em', line: '1.375em', weight: '500' },
    subtitle: { size: '1em', line: '1.5714285714em', weight: '500' },
  },
};
