import { AppFeature } from '@spryker-oryx/core';
import { productFeature } from '@spryker-oryx/product';
import { mockProductProviders } from './src/mock-product.providers';

export const mockProductFeature: AppFeature = {
  ...productFeature,
  providers: [...(productFeature.providers ?? []), ...mockProductProviders],
};
