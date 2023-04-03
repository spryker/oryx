import { DesignToken } from '@spryker-oryx/core';
import { Size } from '@spryker-oryx/utilities';
import { darkColor } from './color-dark.tokens';
import { color } from './color.tokens';
import { darkTokens } from './other-dark';
import { tokens } from './other.tokens';

import {
  typographySmallTokens,
  typographyTokens,
} from '../backoffice/typography.tokens';
import { commonTokensSmall } from '../common-tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from './layout.tokens';

export const backofficeNgTokens: DesignToken[] = [
  {
    color,
    ...tokens,
    typography: Object.assign(
      {},
      typographyTokens.typography,
      typographySmallTokens.typography
    ),
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
      screen: Size.Md,
    },
    ...layoutMdTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
    ...commonTokensSmall,
  },
];
