import { backofficeResources } from '@spryker-oryx/presets/backoffice';
import { fesResources } from '@spryker-oryx/presets/fes';
import { fulfillmentResources } from '@spryker-oryx/presets/fulfillment';
import { storefrontResources } from '@spryker-oryx/presets/storefront';
import {
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
