import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { tokens } from './other.tokens';

import {
  typographySmallTokens,
  typographyTokens,
} from '../backoffice/typography.tokens';
import { commonTokensSmall } from '../common-tokens';
import { layoutMdTokens, layoutSmTokens, layoutTokens } from '../layout.tokens';

export const backofficeNgTokens: DesignToken[] = [
  {
    color,
    ...tokens,
    typography: Object.assign(
      {},
      typographyTokens.typography,
      typographySmallTokens.typography
    ),
    ...layoutTokens,
    layout: {
      container: {
        width: '414px',
        bleed: '10px',
      },
    },
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
