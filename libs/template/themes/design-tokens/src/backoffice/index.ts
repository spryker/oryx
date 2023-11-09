import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { commonTokensSmall } from '../common-tokens';
import { layoutSmTokens, layoutTokens } from '../layout.tokens';
import { buttonTokens } from './button.token';
import { layoutMdTokens } from './layout.tokens';
import { tokens } from './other.tokens';
import {
  typographyMediumAndLargerTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

export const backofficeTokens: DesignToken[] = [
  ...buttonTokens,
  {
    color,
    ...tokens,
    ...typographyTokens,
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
