import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { commonTokensSmall } from '../common-tokens';
import { darkColor } from './color-dark.tokens';
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
    ...layoutSmTokens,
    ...typographySmallTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...layoutMdTokens,
    ...typographyMediumTokens,
    ...commonTokensSmall,
  },
  {
    media: {
      screen: Size.Lg,
    },
    ...layoutTokens,
  },
];
