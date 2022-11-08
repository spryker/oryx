import {
  backofficeNgTheme,
  backofficeTheme,
  storefrontTheme,
} from '@spryker-oryx/theme';
import {
  uiBackofficeComponents,
  uiStorefrontComponents,
} from '@spryker-oryx/ui';

export const theme = {
  default: 'backoffice',
  list: {
    storefront: [{ ...storefrontTheme, components: uiStorefrontComponents }],
    backoffice: [{ ...backofficeTheme, components: uiBackofficeComponents }],
    'backoffice-ng': [
      { ...backofficeNgTheme, components: uiBackofficeComponents },
    ],
  },
};
