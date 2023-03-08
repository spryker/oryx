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
  typography: { h1: { align: 'center' } },
};

export const typographyMediumTokens: ThemeToken = {
  typography: {},
};
