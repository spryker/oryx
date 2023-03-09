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
    h1: { size: '1.572em', line: '1.364em' },
    h2: { size: '1.286em', line: '1.44em', weight: '700' },
    h3: { size: '1.143em', line: '1.375em' },
    h4: { size: '1em', line: '1.572em' },
    h5: { size: '1em', line: '1.572em', weight: '700' },
    h6: { size: '0.857em', line: '1.333em' },
    subtitle: { size: '0.857em', line: '1.333em' },
    caption: { size: '0.857em', line: '1.333em' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.857em', line: '1.2em' },
    h2: { size: '2.143em', line: '1.2em' },
    h3: { size: '1.572em', line: '1.364em', weight: '500' },
    h4: { size: '1.286em', line: '1.444em', weight: '500' },
    h5: { size: '1.143em', line: '1.5em' },
    h6: { size: '1.143em', line: '1.5em' },
    subtitle: { size: '0.857em', line: '1.333em' },
    caption: { size: '0.857em', line: '1.333em' },
  },
};
