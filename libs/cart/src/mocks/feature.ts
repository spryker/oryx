import { cartComponents } from '@spryker-oryx/cart';
import { AppFeature } from '@spryker-oryx/core';
import { mockCartProviders } from './src';

export const mockCartFeature: AppFeature = {
  components: cartComponents,
  providers: mockCartProviders,
};
