import { AppFeature } from '@spryker-oryx/core';
import { orderComponents } from '@spryker-oryx/order';
import { mockOrderProviders } from './src';

export const mockOrderFeature: AppFeature = {
  providers: mockOrderProviders,
  components: orderComponents,
};
