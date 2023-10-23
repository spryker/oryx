import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { color } from '../color.tokens';
import { tokens } from './other.tokens';

import { buttonTokens } from '../backoffice/button.token';
import {
  typographySmallTokens,
  typographyTokens,
} from '../backoffice/typography.tokens';
import { layoutSmTokens, layoutTokens } from '../layout.tokens';

export const backofficeNgTokens: DesignToken[] = [
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
    container: {
      // 510px (or 530px) would be align better width min width of modals
      // alternatively, we could introduce max-width to modals to be not
      // larger than the container width
      width: '414px',
      bleed: '0px',
    },
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
  },
];
