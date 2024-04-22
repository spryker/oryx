import { storefrontResources } from '@spryker-oryx/presets/storefront';
import {
  storefrontTheme,
} from '@spryker-oryx/themes';

export const theme = {
  default: 'storefront',
  list: {
    storefront: [storefrontTheme],
  },
};

export const resource = {
  default: 'storefront',
  list: {
    storefront: storefrontResources,
  },
};
