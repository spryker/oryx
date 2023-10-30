import { backofficeResources } from '@spryker-oryx/presets/backoffice';
import { backofficeNgResources } from '@spryker-oryx/presets/backoffice-ng';
import { fesResources } from '@spryker-oryx/presets/fes';
import { fulfillmentResources } from '../../../../libs/template/presets/fulfillment';
import { storefrontResources } from '@spryker-oryx/presets/storefront';
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
    fulfillment: fulfillmentResources,
    fes: fesResources,
  },
};
