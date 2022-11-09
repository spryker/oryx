import {
  backofficeNgTheme,
  backofficeTheme,
  storefrontTheme,
} from '@spryker-oryx/theme';

export const theme = {
  default: 'backoffice',
  list: {
    storefront: [storefrontTheme],
    backoffice: [backofficeTheme],
    'backoffice-ng': [backofficeNgTheme],
  },
};
