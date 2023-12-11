import { AppFeature } from '@spryker-oryx/core';
import { merchantComponents } from '@spryker-oryx/merchant';
import { mockMerchantProviders } from './src';

export const mockMerchantFeature: AppFeature = {
  providers: mockMerchantProviders,
  components: merchantComponents,
};
