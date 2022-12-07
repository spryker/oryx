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
    caption: '12px',
    base: '14px',
    medium: '16px',
  },
  'font-weight': {
    medium: '500',
    semibold: '600',
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: { size: '1.375em', line: '1.364em' },
    h2: { size: '1.125em', line: '1.444em' },
    h3: { size: '1em', line: '1.375em' },
    h4: { size: '0.875em', line: '1.571em' },
    h5: { size: '0.875em', line: '1.571em' },
    h6: { size: '0.75em', line: '1.333em' },
    subtitle: { size: '0.875em', line: '1.571em' },
  },
};

export const typographyMediumTokens: ThemeToken = {
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
