import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';
import { buttonTokens } from '../backoffice/button.token';
import { tokens } from '../backoffice/other.tokens';
import {
  typographySmallTokens,
  typographyTokens,
} from '../backoffice/typography.tokens';
import { color } from '../color.tokens';
import { layoutSmTokens, layoutTokens } from '../layout.tokens';

export const mobileBackofficeTokens: DesignToken[] = [
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
      width: '414px',
      bleed: '0px',
    },
    modal: {
      width: '404px',
      bleed: '5px',
    },
  },
  {
    media: {
      screen: Size.Sm,
    },
    ...layoutSmTokens,
  },
];
