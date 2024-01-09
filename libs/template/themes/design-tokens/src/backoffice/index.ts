import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { commonTokens, commonTokensSmall } from '../common-tokens';
import { layoutSmTokens, layoutTokens } from '../layout.tokens';
import { buttonTokens } from './button.token';
import { collapsibleTokens } from './collapsible.token';
import { layoutMdTokens } from './layout.tokens';
import { tokens } from './other.tokens';
import {
  typographyMediumAndLargerTokens,
  typographySmallTokens,
  typographyTokens,
} from './typography.tokens';

export const backofficeTokens: DesignToken[] = [
  ...buttonTokens,
  ...collapsibleTokens,
  {
    color,
    ...commonTokens,
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
