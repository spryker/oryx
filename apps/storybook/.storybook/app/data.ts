import {
  backofficeNgResources,
  backofficeResources,
  fulfillmentResources,
  storefrontResources,
} from '@spryker-oryx/presets';
import {
  backofficeNgTheme,
  backofficeTheme,
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
  },
};

export const resource = {
  default: 'backoffice',
  list: {
    storefront: storefrontResources,
    backoffice: backofficeResources,
    'backoffice-ng': backofficeNgResources,
    fulfillment: fulfillmentResources,
  },
};
