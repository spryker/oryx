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

import { layoutMdTokens, layoutSmTokens, layoutTokens } from './layout.tokens';

export const backofficeTokens: DesignToken[] = [
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
      screen: Size.Lg,
    },
    ...layoutTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...typographySmallTokens,
    ...layoutSmTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...typographyMediumTokens,
    ...layoutMdTokens,
  },
];

// TODO: This should be dropped after HRZ-2239
export const backofficeTokensWithoutDarkMode: DesignToken[] = [
  {
    color,
    ...tokens,
    ...typographyTokens,
  },
  {
    media: {
      screen: Size.Lg,
    },
    ...layoutTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...typographySmallTokens,
    ...layoutSmTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...typographyMediumTokens,
    ...layoutMdTokens,
  },
];
