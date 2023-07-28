import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { commonTokensSmall } from '../common-tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from '../layout.tokens';

import { iconTokens } from './icon.token';
import { tokens } from './other.tokens';
import {
  typographyMediumAndLargerTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

export const storefrontTokens: DesignToken[] = [
  {
    color,
    ...tokens,
    ...typographyTokens,
    ...iconTokens,
    ...layoutTokens,
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
    ...typographySmallTokens,
    ...commonTokensSmall,
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
      screen: Size.Lg,
    },
    ...typographyMediumAndLargerTokens,
  },
];
