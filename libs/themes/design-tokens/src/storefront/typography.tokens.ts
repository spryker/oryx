import { ThemeToken } from '@spryker-oryx/core';

export const typographyTokens: ThemeToken = {
  typography: {
    font: {
      face: '"Montserrat", sans-serif',
      size: '14px',
      weight: '500',
    },
  },
  // TODO: drop these tokens
  'font-size': {
    base: '14px',
    medium: '16px',
    large: '22px',
  },
  'font-weight': {
    medium: '500',
    semibold: '600',
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {},
};

export const typographyMediumTokens: ThemeToken = {
  typography: {
    h1: { size: '2.857em', line: '1.2em', weight: '600' },
    h2: { size: '2.143em', line: '1.2em', weight: '600' },
    h3: { size: '1.571em', line: '1.364em', weight: '500' },
    h4: { size: '1.286em', line: '1.444em', weight: '500' },
    h5: { size: '1.143em', line: '1.5em', weight: '600' },
    h6: { size: '1.143em', line: '1.5em', weight: '500' },
    subtitle: { size: '0.857em', line: '1.333em', weight: '600' },
  },
};
