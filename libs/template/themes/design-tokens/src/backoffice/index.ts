import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { commonTokensSmall } from '../common-tokens';
import { layoutSmTokens, layoutTokens } from '../layout.tokens';
import { buttonTokens } from './button.token';
import { layoutMdTokens } from './layout.tokens';
import { tokens } from './other.tokens';
import { typographySmallTokens, typographyTokens } from './typography.tokens';

export const backofficeTokens: DesignToken[] = [
  ...buttonTokens,
  {
    color,
    ...tokens,
    typography: Object.assign(
      {},
      typographyTokens.typography,
      typographySmallTokens.typography
    ),
    ...layoutTokens,
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
