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
    h1: { size: '1.285em', line: '1.857em', weight: '600' },
    h2: { size: '1.125em', line: '1.574em', weight: '600' },
    h3: { size: '1.143em', line: '1.375em', weight: '600' },
    h4: { size: '0.875em', line: '1.125em', weight: '600' },
    h5: { size: '0.875em', line: '1.571em' },
    h6: { size: '0.875em', line: '1.333em', weight: '600' },
    subtitle: { size: '0.875em', line: '1.571em' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.143em', line: '1.333em', weight: '600' },
    h2: { size: '1.857em', line: '1.462em', weight: '600' },
    h3: { size: '1.429em', line: '1.4em', weight: '600' },
    h4: { size: '1.286em', line: '1.444em', weight: '600' },
    h5: { size: '1.143em', line: '1.375em', weight: '600' },
    h6: { size: '1.143em', line: '1.375em', weight: '500' },
    subtitle: { size: '1em', line: '1.571em', weight: '500' },
  },
};
