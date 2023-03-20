import { DesignToken } from '@spryker-oryx/core';
import { backofficeTokens } from '@spryker-oryx/themes/design-tokens';

export const backofficeNgTokens: DesignToken[] = [
  ...backofficeTokens,
  {
    card: {
      header: {
        padding: '14px 10px 10px',
      },
      body: {
        padding: '9px 10px 16px',
      },
      footer: {
        padding: '0 10px 12px',
      },
    },
    modal: {
      header: {
        padding: '18px 30px',
      },
      body: {
        padding: '18px 30px',
      },
      footer: {
        padding: '0 30px',
      },
    },
  },
];
