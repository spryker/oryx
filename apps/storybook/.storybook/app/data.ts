import {
  backofficeNgResources,
  backofficeResources,
  fesResources,
  fulfillmentResources,
  storefrontResources,
} from '@spryker-oryx/presets';
import {
  backofficeNgTheme,
  backofficeTheme,
  fesTheme,
  fulfillmentTheme,
  storefrontTheme,
} from '@spryker-oryx/themes';

export const theme = {
  default: 'backoffice',
  list: {
    storefront: [storefrontTheme],
    backoffice: [backofficeTheme],
    'backoffice-ng': [backofficeNgTheme],
    fulfillment: [fulfillmentTheme],
    fes: [fesTheme],
  },
};

export const resource = {
  default: 'backoffice',
  list: {
    storefront: storefrontResources,
    backoffice: backofficeResources,
    'backoffice-ng': backofficeNgResources,
    fulfillment: fulfillmentResources,
    fes: fesResources,
  },
};
