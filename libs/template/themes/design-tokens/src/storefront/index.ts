import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { darkColor } from './color-dark.tokens';
import { color } from './color.tokens';
import { darkTokens } from './other-dark';
import { tokens } from './other.tokens';
import {
  typographyMediumTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

export const storefrontTokens: DesignToken[] = [
  {
    color,
    ...tokens,
    ...typographyTokens,
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
    ...typographySmallTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...typographyMediumTokens,
    container: {
      padding: '30px',
    },
  },
  {
    media: {
      screen: Size.Lg,
    },
    container: {
      padding: '50px',
    },
  },
];
