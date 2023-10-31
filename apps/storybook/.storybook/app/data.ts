import { backofficeResources } from '@spryker-oryx/presets/backoffice';
import { fesResources } from '@spryker-oryx/presets/fes';
import { storefrontResources } from '@spryker-oryx/presets/storefront';
import {
  backofficeNgTheme,
  backofficeTheme,
  fesTheme,
  fulfillmentTheme,
  storefrontTheme,
} from '@spryker-oryx/themes';
import { fulfillmentResources } from '@spryker-oryx/presets/fulfillment';

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
    fulfillment: fulfillmentResources,
    fes: fesResources,
  },
};
