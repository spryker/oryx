import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { darkColor } from './color-dark.tokens';
import { color } from './color.tokens';
import { darkTokens } from './other-dark';
import { tokens } from './other.tokens';

export const backofficeTokens: DesignToken[] = [
  {
    color,
    ...tokens,
  },
  {
    media: {
      mode: 'dark',
    },
    color: darkColor,
    ...darkTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    font: {
      weight: {
        medium: '600',
      },
      size: {
        base: '16px',
      },
    },
  },
  {
    media: {
      screen: Size.Md,
    },
    font: {
      weight: {
        medium: '500',
      },
      size: {
        base: '14px',
      },
    },
  },
];
