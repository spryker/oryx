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
import { layoutMdTokens, layoutSmTokens, layoutTokens } from '../layout.tokens';
import { iconTokens } from './icon.token';

export const backofficeTokens: DesignToken[] = [
  {
    color,
    ...tokens,
    ...typographyTokens,
    ...iconTokens,
    ...layoutTokens,
    button: {
      icon: {
        sm: '13.3px',
        md: '13.3px',
        lg: '13.3px',
      },
    },
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
