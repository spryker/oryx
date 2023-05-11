import {
  b2cResources,
  b2cTheme,
  backofficeNgResources,
  backofficeNgTheme,
  backofficeResources,
  backofficeTheme,
  fulfillmentResources,
  fulfillmentTheme,
} from '@spryker-oryx/presets';

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
    fulfillment: [fulfillmentResources],
  },
};
