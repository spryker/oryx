import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { darkColor } from './color-dark.tokens';
import { color } from './color.tokens';
import { darkTokens } from './other-dark';
import { tokens } from './other.tokens';
import {
  typographyMediumAndLargerTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

import { commonTokensSmall } from '../common-tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from './layout.tokens';

export const backofficeNgTokens: DesignToken[] = [
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
    ...typographyMediumAndLargerTokens,
  },
  {
    media: {
      screen: Size.Md,
    },
    ...layoutMdTokens,
    ...typographyMediumAndLargerTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
    ...typographySmallTokens,
    ...commonTokensSmall,
  },
];
