import {
  b2cResources,
  backofficeNgResources,
  backofficeResources,
  fulfillmentResources,
} from '@spryker-oryx/presets';
import {
  backofficeNgTheme,
  backofficeTheme,
  fulfillmentTheme,
  storefrontTheme as b2cTheme,
} from '@spryker-oryx/themes';

export const theme = {
  default: 'backoffice',
  list: {
    b2c: [b2cTheme],
    backoffice: [backofficeTheme],
    'backoffice-ng': [backofficeNgTheme],
    fulfillment: [fulfillmentTheme],
  },
};

export const resource = {
  default: 'backoffice',
  list: {
    b2c: b2cResources,
    backoffice: backofficeResources,
    'backoffice-ng': backofficeNgResources,
    fulfillment: fulfillmentResources,
  },
};
