import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { tokens } from './other.tokens';
import {
  typographyMediumAndLargerTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

import { commonTokensSmall } from '../common-tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from './layout.tokens';

export const backofficeTokens: DesignToken[] = [
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
