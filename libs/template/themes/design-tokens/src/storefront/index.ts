import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { colorFix, colorFixDark } from '../color-fix';
import { color } from './color.tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from './layout.tokens';
import { darkTokens } from './other-dark';
import { tokens } from './other.tokens';
import {
  typographyMediumTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

export const storefrontTokens: DesignToken[] = [
  {
    color: {
      ...color,
      ...colorFix,
    },
    ...tokens,
    ...typographyTokens,
  },
  {
    media: {
      mode: 'dark',
    },
    color: {
      ...color,
      ...colorFixDark,
    },
    ...darkTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
    ...typographySmallTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...layoutMdTokens,
    ...typographyMediumTokens,
  },
  {
    media: {
      screen: Size.Lg,
    },
    ...layoutTokens,
  },
];
